
'use client';

import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getCategories } from '@/lib/data';
import { ArrowLeft, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useProducts } from '@/hooks/use-products';

const productSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  description: z.string().min(10, 'Description is too short'),
  price: z.coerce.number().min(0, 'Price must be a positive number'),
  category: z.string().min(1, 'Please select a category'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  isFeatured: z.boolean().default(false),
  images: z.array(z.object({ url: z.string().url({ message: "Please enter a valid image URL." }) })).min(1, "At least one image is required."),
  deliveryInfo: z.string().optional(),
  discountPercentage: z.coerce.number().int().min(0).max(100).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const categories = getCategories();
  const { addProduct } = useProducts();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      isFeatured: false,
      category: '',
      images: [{ url: '' }],
      deliveryInfo: '',
      discountPercentage: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ url: "" });
    }
  }, [fields, append]);

  const onSubmit = (data: ProductFormValues) => {
    const productData = {
        ...data,
        images: data.images.map(image => ({ url: image.url, hint: '' })),
        discountPercentage: data.discountPercentage || 0,
    };
    addProduct(productData);
    toast({
      title: 'Product Created',
      description: `Product "${data.name}" has been created successfully.`,
    });
    router.push('/admin/products');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center gap-4">
           <Button variant="outline" size="icon" className="h-7 w-7" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Add New Product
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Discard
            </Button>
            <Button size="sm" type="submit">Save Product</Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8 mt-4">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>
                  Enter the main details for your new product.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Zanzibar Serenity Bed" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A beautiful description of the product."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Product Images</CardTitle>
                    <CardDescription>
                    Add one or more image URLs for your product.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                        <FormField
                        control={form.control}
                        name={`images.${index}.url`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                            <FormControl>
                                <Input placeholder="https://example.com/image.png" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                    ))}
                    <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ url: "" })}
                    >
                    Add Image
                    </Button>
                </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Stock</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (TZS)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1200000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="15" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-6">
                 <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Featured Product</FormLabel>
                        <FormDescription>
                          Display on homepage.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Discount & Delivery</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="discountPercentage"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Discount (%)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="10" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="deliveryInfo"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Delivery Info</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Free Delivery" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
          </div>
        </div>
         <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              Discard
            </Button>
            <Button size="sm" type="submit">Save Product</Button>
          </div>
      </form>
    </Form>
  );
}
