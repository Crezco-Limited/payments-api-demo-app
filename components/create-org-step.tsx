"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrg } from "@/contexts/org-context";
import { OrgDataType } from "@/types/org-data";
import { useState } from "react";

const formSchema = z.object({
  partnerClientId: z.string().min(1, "Partner Client ID is required"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  accountEmail: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function CreateOrgStep() {
  const { orgData, setOrgData } = useOrg();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partnerClientId: orgData.partnerClientId,
      companyName: orgData.companyName,
      accountEmail: "",
      firstName: "",
      lastName: "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setError(null);
    setOrgData((prev: OrgDataType) => ({ ...prev, ...values } as OrgDataType));
    try {
      const response = await fetch("/api/organisations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (response.status === 409) {
        throw new Error(
          "Organisation with that company ID already exists. Enter a different company ID"
        );
      }
      if (!response.ok) {
        throw new Error("Something went wrong. Try again later");
      }

      const data = await response.json();
      setOrgData((prev: OrgDataType) => ({
        ...prev,
        organisationId: data.organisationId,
        companyName: data.companyName,
      }));
      router.push(`/${data.organisationId}/connect`);
    } catch (error) {
      const err = error as Error;
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function onReset() {
    setError(null);
    const initialValues: FormData = {
      partnerClientId: "",
      companyName: "",
      accountEmail: "",
      firstName: "",
      lastName: "",
    };
    // setOrgData(null);
    form.reset(initialValues);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="partnerClientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        )}
        <div className="flex flex-row gap-8 w-full">
          <Button
            onClick={onReset}
            variant="outline"
            type="button"
            className="w-full"
          >
            Reset
          </Button>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Organisation"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
