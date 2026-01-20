'use client';

import { useMemo } from 'react';
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
import { useOrders } from '@/hooks/use-orders';
import { useProducts } from '@/hooks/use-products';
import { getCategories } from '@/lib/data';

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
  const { orders, isLoading: isLoadingOrders } = useOrders();
  const { getProductById, isLoading: isLoadingProducts } = useProducts();
  const categories = useMemo(() => getCategories(), []);

  const isLoading = isLoadingOrders || isLoadingProducts;

  const { weeklySales, orderStatusData, categoryRevenue } = useMemo(() => {
    if (isLoading || !orders.length) {
      return { weeklySales: [], orderStatusData: [], categoryRevenue: [] };
    }

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

    return { weeklySales, orderStatusData, categoryRevenue };
  }, [orders, isLoading, getProductById, categories]);

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
