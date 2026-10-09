"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="font-serif text-2xl text-[#F4F0E6]">
            Open New Vault
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 max-w-lg mx-auto w-full">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="text-[10px] font-mono uppercase tracking-wider text-[#8E8E93]"
              >
                Vault / Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g. Everyday Checking, Reserve Savings"
                className="bg-[#16171B] border-[#26272D] text-sm text-[#F4F0E6] focus:border-[#EAE0D5]"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-[#E05A47] font-mono">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="type"
                className="text-[10px] font-mono uppercase tracking-wider text-[#8E8E93]"
              >
                Vault Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger id="type" className="bg-[#16171B] border-[#26272D] text-sm text-[#F4F0E6]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-[#16171B] border-[#26272D] text-[#F4F0E6] text-xs">
                  <SelectItem value="CURRENT">Current / Checking</SelectItem>
                  <SelectItem value="SAVINGS">Savings Vault</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-[#E05A47] font-mono">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="balance"
                className="text-[10px] font-mono uppercase tracking-wider text-[#8E8E93]"
              >
                Initial Balance (USD)
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-[#16171B] border-[#26272D] text-sm font-mono text-[#F4F0E6] focus:border-[#EAE0D5]"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-xs text-[#E05A47] font-mono">{errors.balance.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg bg-[#16171B] border border-[#212226] p-3.5">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-xs font-medium text-[#F4F0E6] cursor-pointer"
                >
                  Set as Primary Vault
                </label>
                <p className="text-[11px] font-mono text-[#71727A]">
                  This vault will be chosen by default for incoming movements
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            <div className="flex gap-3 pt-3">
              <DrawerClose asChild>
                <Button type="button" variant="dark" className="flex-1 text-xs">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                variant="cream"
                className="flex-1 text-xs font-medium shadow-sm"
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#0C0D0E]" />
                    Establishing Vault...
                  </>
                ) : (
                  "Create Vault"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
