import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { toast } from "sonner";

interface Customer {
	name: string;
	email: string;
	id: number;
}

export default function CustomersTable({ customers }: { customers: Customer[] }) {
	const deleteCustomer = async (id: number) => { 
		try {
			const request = await fetch(`/api/customers?id=${id}`, {
				method: "DELETE",
			});
			const response = await request.json();
			toast.success(response.message);
			// alert(response.message);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="text-slate-900">Name</TableHead>
					<TableHead className="text-slate-900">Email</TableHead>
					<TableHead className="text-slate-900">Action</TableHead>
				</TableRow>
			</TableHeader>

			<TableBody>
				{customers.length > 0 ? (
					customers.map((customer) => (
						<TableRow key={customer.id}>
							<TableCell className="text-sm">{customer.name}</TableCell>
							<TableCell className="text-sm">{customer.email}</TableCell>
							<TableCell className="text-sm">
								<Button
									variant="destructive"
									size="sm"
									onClick={() => deleteCustomer(customer.id)}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell colSpan={3} className="text-center text-sm text-muted">
							No customers found.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
