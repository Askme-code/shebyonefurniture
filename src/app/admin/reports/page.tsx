
'use client';

import { useMemo, useState, useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { format, startOfISOWeek, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { File, Lightbulb } from 'lucide-react';
import { useAllOrders } from '@/hooks/use-all-orders';
import { useProducts } from '@/hooks/use-products';
import { getCategories } from '@/lib/data';
import { generateReportInsights } from '@/ai/flows/generate-report-insights';
import { Skeleton } from '@/components/ui/skeleton';


declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const chartConfig: ChartConfig = {
  revenue: {
    label: 'Revenue',
  },
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-2))',
  },
  processing: {
    label: 'Processing',
    color: 'hsl(var(--chart-3))',
  },
  delivered: {
    label: 'Delivered',
    color: 'hsl(var(--chart-1))',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'hsl(var(--chart-5))',
  },
};

export default function ReportsPage() {
  const { orders, isLoading: isLoadingOrders } = useAllOrders();
  const { getProductById, isLoading: isLoadingProducts } = useProducts();
  const categories = useMemo(() => getCategories(), []);

  const [insights, setInsights] = useState('');
  const [isInsightsLoading, setIsInsightsLoading] = useState(true);

  const isLoading = isLoadingOrders || isLoadingProducts;

  const { weeklySales, orderStatusData, categoryRevenue, totalRevenue } = useMemo(() => {
    if (isLoading || !orders.length) {
      return { weeklySales: [], orderStatusData: [], categoryRevenue: [], totalRevenue: 0 };
    }

    const totalRevenue = orders.reduce((sum, order) => order.status === 'Delivered' ? sum + order.total : sum, 0);

    // Weekly sales for the last 8 weeks
    const weeklySalesMap = new Map<string, number>();
    for (let i = 0; i < 8; i++) {
      const weekStartDate = startOfISOWeek(
        new Date(new Date().setDate(new Date().getDate() - i * 7))
      );
      const weekKey = format(weekStartDate, 'yyyy-MM-dd');
      weeklySalesMap.set(weekKey, 0);
    }

    orders
      .filter((o) => o.status === 'Delivered')
      .forEach((order) => {
        const weekStartDate = startOfISOWeek(order.createdAt);
        const weekKey = format(weekStartDate, 'yyyy-MM-dd');
        if (weeklySalesMap.has(weekKey)) {
          weeklySalesMap.set(
            weekKey,
            (weeklySalesMap.get(weekKey) || 0) + order.total
          );
        }
      });

    const weeklySales = Array.from(weeklySalesMap.entries())
      .map(([date, revenue]) => ({
        date: format(parseISO(date), 'MMM d'),
        revenue,
      }))
      .reverse();

    // Order status distribution
    const statusCounts = orders.reduce(
      (acc, order) => {
        const statusKey = order.status.toLowerCase() as keyof typeof chartConfig;
        acc[statusKey] = (acc[statusKey] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const orderStatusData = Object.entries(statusCounts).map(
      ([name, value]) => ({ name, value, fill: `var(--color-${name})` })
    );

    // Revenue by category
    const categoryMap = new Map<string, number>();
    categories.forEach((cat) => categoryMap.set(cat.name, 0));

    orders
      .filter((o) => o.status === 'Delivered')
      .forEach((order) => {
        order.items.forEach((item) => {
          const product = getProductById(item.productId);
          if (product) {
            const category = categories.find((c) => c.id === product.category);
            if (category) {
              categoryMap.set(
                category.name,
                (categoryMap.get(category.name) || 0) +
                  item.price * item.quantity
              );
            }
          }
        });
      });

    const categoryRevenue = Array.from(categoryMap.entries()).map(
      ([name, revenue]) => ({ name, revenue })
    ).filter(c => c.revenue > 0);

    return { weeklySales, orderStatusData, categoryRevenue, totalRevenue };
  }, [orders, isLoading, getProductById, categories]);

  useEffect(() => {
    const fetchInsights = async () => {
      if (isLoading || weeklySales.length === 0) {
        return;
      }
      
      setIsInsightsLoading(true);
      try {
        const result = await generateReportInsights({
          weeklySales,
          orderStatusData,
          categoryRevenue,
          totalRevenue
        });
        setInsights(result);
      } catch (error) {
        console.error("Failed to generate AI insights:", error);
        setInsights("Could not generate insights at this time. Please try again later.");
      } finally {
        setIsInsightsLoading(false);
      }
    };

    fetchInsights();
  }, [weeklySales, orderStatusData, categoryRevenue, totalRevenue, isLoading]);


  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Sheby One Furniture - Reports", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report generated on: ${new Date().toLocaleDateString()}`, 14, 28);

    let finalY = 35;

    if (weeklySales.length > 0) {
        doc.setFontSize(14);
        doc.text("Weekly Sales (Last 8 Weeks)", 14, finalY + 5);
        doc.autoTable({
            startY: finalY + 7,
            head: [['Date', 'Revenue (TZS)']],
            body: weeklySales.map(d => [d.date, d.revenue.toLocaleString()]),
        });
        finalY = (doc as any).lastAutoTable.finalY;
    }

    if (orderStatusData.length > 0) {
        doc.setFontSize(14);
        doc.text("Order Status Distribution", 14, finalY + 10);
        doc.autoTable({
            startY: finalY + 12,
            head: [['Status', 'Count']],
            body: orderStatusData.map(d => [d.name, d.value]),
        });
        finalY = (doc as any).lastAutoTable.finalY;
    }

    if (categoryRevenue.length > 0) {
        doc.setFontSize(14);
        doc.text("Revenue by Category", 14, finalY + 10);
        doc.autoTable({
            startY: finalY + 12,
            head: [['Category', 'Revenue (TZS)']],
            body: categoryRevenue.map(d => [d.name, d.revenue.toLocaleString()]),
        });
    }

    doc.save('sheby-furniture-reports.pdf');
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    if(weeklySales.length > 0) {
        const ws1 = XLSX.utils.json_to_sheet(weeklySales.map(item => ({ 'Date': item.date, 'Revenue (TZS)': item.revenue })));
        XLSX.utils.book_append_sheet(wb, ws1, "Weekly Sales");
    }
    if(orderStatusData.length > 0) {
        const ws2 = XLSX.utils.json_to_sheet(orderStatusData.map(d => ({ Status: d.name, Count: d.value })));
        XLSX.utils.book_append_sheet(wb, ws2, "Order Status");
    }
    if(categoryRevenue.length > 0) {
        const ws3 = XLSX.utils.json_to_sheet(categoryRevenue.map(item => ({ 'Category': item.name, 'Revenue (TZS)': item.revenue })));
        XLSX.utils.book_append_sheet(wb, ws3, "Revenue by Category");
    }
    XLSX.writeFile(wb, "sheby-furniture-reports.xlsx");
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-8">
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <div className="h-6 w-1/2 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] bg-muted rounded animate-pulse"></div>
                </CardContent>
            </Card>
             <Card className="lg:col-span-3">
                <CardHeader>
                    <div className="h-6 w-1/2 bg-muted rounded animate-pulse mb-2"></div>
                    <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                </CardHeader>
                <CardContent className="flex items-center justify-center py-6">
                    <div className="h-[250px] w-[250px] bg-muted rounded-full animate-pulse"></div>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <div className="h-6 w-1/3 bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] bg-muted rounded animate-pulse"></div>
            </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-headline tracking-tight">Reports &amp; Analytics</h1>
          <p className="text-lg text-muted-foreground">An overview of your store's performance.</p>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <File className="mr-2 h-4 w-4" /> Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportPDF}>Export as PDF</DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportExcel}>Export as Excel</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-3">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <CardTitle>AI-Powered Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {isInsightsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : (
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              {insights.split('* ').filter(item => item.trim() !== '').map((item, index) => (
                <li key={index}>{item.trim()}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Weekly Sales</CardTitle>
            <CardDescription>
              Revenue from delivered orders over the last 8 weeks.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer
              config={{
                revenue: { label: 'Revenue', color: 'hsl(var(--chart-1))' },
              }}
              className="h-[300px] w-full"
            >
              <BarChart data={weeklySales}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('en-US', {
                      notation: 'compact',
                      compactDisplay: 'short',
                      style: 'currency',
                      currency: 'TZS',
                    }).format(value as number)
                  }
                />
                <ChartTooltip
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Order Status Distribution</CardTitle>
            <CardDescription>
              A breakdown of all orders by their current status.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center py-6">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                >
                  {orderStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="name" />}
                  className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
          <CardDescription>
            Total revenue from delivered orders for each category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
            }}
            className="h-[350px] w-full"
          >
            <BarChart
              data={categoryRevenue}
              layout="vertical"
              margin={{ left: 20 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={100}
              />
              <XAxis
                type="number"
                dataKey="revenue"
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-US', {
                    notation: 'compact',
                    compactDisplay: 'short',
                    style: 'currency',
                    currency: 'TZS',
                  }).format(value as number)
                }
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
