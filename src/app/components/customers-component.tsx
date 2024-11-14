"use client";

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import CustomersTable from "../components/CustomersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Customers() {
	const { isLoaded, isSignedIn, user } = useUser();
	const [customerName, setCustomerName] = useState<string>("");
	const [customerEmail, setCustomerEmail] = useState<string>("");
	const [customerAddress, setCustomerAddress] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [customers, setCustomers] = useState([]);

	const fetchCustomers = useCallback(async () => {
		try {
			const res = await fetch(`/api/customers?userID=${user?.id}`);
			const data = await res.json();
			setCustomers(data.customers);
		} catch (err) {
			console.error(err);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			fetchCustomers();
		}
	}, [fetchCustomers, user]);

	const createCustomer = async () => {
		setLoading(true);
		try {
			const request = await fetch("/api/customers", {
				method: "POST",
				body: JSON.stringify({
					userID: user?.id,
					customerName,
					customerEmail,
					customerAddress,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const response = await request.json();
			// alert(response.message);
            toast.success(response.message);
			setCustomerAddress("");
			setCustomerEmail("");
			setCustomerName("");
			setLoading(false);
		} catch (err) {
			console.error(err);
		}
	};

	const handleAddCustomer = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createCustomer();
	};

	if (!isLoaded || !isSignedIn) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="grid auto-rows-min gap-4 md:grid-cols-3">
					<Skeleton className="aspect-video rounded-xl bg-muted/50" />
					<Skeleton className="aspect-video rounded-xl bg-muted/50" />
					<Skeleton className="aspect-video rounded-xl bg-muted/50" />
				</div>
				<Skeleton className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
			</div>
		);
	}

	return (
		<div className="w-full">
			<main className="min-h-[90vh] flex items-start">
				<div className="md:w-5/6 w-full h-full p-6">
					<h2 className="text-2xl font-bold">Customers</h2>
					<p className="opacity-70 mb-4">Create and view all your customers</p>

					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Add a New Customer</CardTitle>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleAddCustomer} method="POST">
								<div className="w-full flex items-center space-x-4 mb-3">
									<section className="w-1/2">
										<label className="block mb-1">Customer&apos;s Name</label>
										<Input
											type="text"
											value={customerName}
											required
											onChange={(e) => setCustomerName(e.target.value)}
										/>
									</section>

									<section className="w-1/2">
										<label className="block mb-1">Email Address</label>
										<Input
											type="email"
											value={customerEmail}
											required
											onChange={(e) => setCustomerEmail(e.target.value)}
										/>
									</section>
								</div>

								<label htmlFor="address" className="block mb-1">
									Billing Address
								</label>
								<Textarea
									name="address"
									id="address"
									rows={3}
									value={customerAddress}
									required
									onChange={(e) => setCustomerAddress(e.target.value)}
								/>

								<Button className="mt-4" disabled={loading}>
									{loading ? "Adding..." : "Add Customer"}
								</Button>
							</form>
						</CardContent>
					</Card>

					<CustomersTable customers={customers} />
				</div>
			</main>
		</div>
	);
}
