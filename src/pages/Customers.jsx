import React, { useMemo, useState } from 'react';
import PageHeader from "../components/PageHeader";

export default function Customers() {
    const initialCustomers = useMemo(() => ([
        { customerId: "CUST-2001", customerName: "Budi Santoso", email: "budi.santoso@mail.com", phone: "0812-3456-7801", loyalty: "Gold" },
        { customerId: "CUST-2002", customerName: "Siti Aminah", email: "siti.aminah@mail.com", phone: "0812-3456-7802", loyalty: "Silver" },
        { customerId: "CUST-2003", customerName: "Andi Wijaya", email: "andi.wijaya@mail.com", phone: "0812-3456-7803", loyalty: "Bronze" },
        { customerId: "CUST-2004", customerName: "Dewi Lestari", email: "dewi.lestari@mail.com", phone: "0812-3456-7804", loyalty: "Gold" },
        { customerId: "CUST-2005", customerName: "Rizky Pratama", email: "rizky.pratama@mail.com", phone: "0812-3456-7805", loyalty: "Silver" },
        { customerId: "CUST-2006", customerName: "Nabila Putri", email: "nabila.putri@mail.com", phone: "0812-3456-7806", loyalty: "Bronze" },
        { customerId: "CUST-2007", customerName: "Ahmad Fauzi", email: "ahmad.fauzi@mail.com", phone: "0812-3456-7807", loyalty: "Gold" },
        { customerId: "CUST-2008", customerName: "Intan Permata", email: "intan.permata@mail.com", phone: "0812-3456-7808", loyalty: "Silver" },
        { customerId: "CUST-2009", customerName: "Dimas Saputra", email: "dimas.saputra@mail.com", phone: "0812-3456-7809", loyalty: "Bronze" },
        { customerId: "CUST-2010", customerName: "Putri Aulia", email: "putri.aulia@mail.com", phone: "0812-3456-7810", loyalty: "Gold" },
        { customerId: "CUST-2011", customerName: "Fajar Nugroho", email: "fajar.nugroho@mail.com", phone: "0812-3456-7811", loyalty: "Silver" },
        { customerId: "CUST-2012", customerName: "Maya Sari", email: "maya.sari@mail.com", phone: "0812-3456-7812", loyalty: "Bronze" },
        { customerId: "CUST-2013", customerName: "Rina Kurnia", email: "rina.kurnia@mail.com", phone: "0812-3456-7813", loyalty: "Gold" },
        { customerId: "CUST-2014", customerName: "Yusuf Ramadhan", email: "yusuf.ramadhan@mail.com", phone: "0812-3456-7814", loyalty: "Silver" },
        { customerId: "CUST-2015", customerName: "Sarah Nabila", email: "sarah.nabila@mail.com", phone: "0812-3456-7815", loyalty: "Bronze" },
        { customerId: "CUST-2016", customerName: "Gilang Prakoso", email: "gilang.prakoso@mail.com", phone: "0812-3456-7816", loyalty: "Gold" },
        { customerId: "CUST-2017", customerName: "Ayu Wulandari", email: "ayu.wulandari@mail.com", phone: "0812-3456-7817", loyalty: "Silver" },
        { customerId: "CUST-2018", customerName: "Hendra Gunawan", email: "hendra.gunawan@mail.com", phone: "0812-3456-7818", loyalty: "Bronze" },
        { customerId: "CUST-2019", customerName: "Tika Maharani", email: "tika.maharani@mail.com", phone: "0812-3456-7819", loyalty: "Gold" },
        { customerId: "CUST-2020", customerName: "Bagas Aditya", email: "bagas.aditya@mail.com", phone: "0812-3456-7820", loyalty: "Silver" },
        { customerId: "CUST-2021", customerName: "Rafi Akbar", email: "rafi.akbar@mail.com", phone: "0812-3456-7821", loyalty: "Bronze" },
        { customerId: "CUST-2022", customerName: "Vina Melati", email: "vina.melati@mail.com", phone: "0812-3456-7822", loyalty: "Gold" },
        { customerId: "CUST-2023", customerName: "Nanda Putra", email: "nanda.putra@mail.com", phone: "0812-3456-7823", loyalty: "Silver" },
        { customerId: "CUST-2024", customerName: "Shinta Ayu", email: "shinta.ayu@mail.com", phone: "0812-3456-7824", loyalty: "Bronze" },
        { customerId: "CUST-2025", customerName: "Arif Setiawan", email: "arif.setiawan@mail.com", phone: "0812-3456-7825", loyalty: "Gold" },
        { customerId: "CUST-2026", customerName: "Dinda Mahesa", email: "dinda.mahesa@mail.com", phone: "0812-3456-7826", loyalty: "Silver" },
        { customerId: "CUST-2027", customerName: "Kevin Pratama", email: "kevin.pratama@mail.com", phone: "0812-3456-7827", loyalty: "Bronze" },
        { customerId: "CUST-2028", customerName: "Anisa Rahma", email: "anisa.rahma@mail.com", phone: "0812-3456-7828", loyalty: "Gold" },
        { customerId: "CUST-2029", customerName: "Doni Haryanto", email: "doni.haryanto@mail.com", phone: "0812-3456-7829", loyalty: "Silver" },
        { customerId: "CUST-2030", customerName: "Nia Paramitha", email: "nia.paramitha@mail.com", phone: "0812-3456-7830", loyalty: "Bronze" },
    ]), []);

    const [customers, setCustomers] = useState(initialCustomers);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [form, setForm] = useState({
        customerName: "",
        email: "",
        phone: "",
        loyalty: "Bronze",
    });

    const loyaltyClass = (loyalty) => {
        if (loyalty === "Gold") return "text-yellow-700 bg-yellow-50";
        if (loyalty === "Silver") return "text-gray-700 bg-gray-100";
        return "text-amber-700 bg-amber-50";
    };

    const createNextCustomerId = (currentCustomers) => {
        const maxNumber = currentCustomers.reduce((acc, item) => {
            const match = String(item.customerId).match(/(\d+)$/);
            const n = match ? Number(match[1]) : 0;
            return Math.max(acc, n);
        }, 0);
        return `CUST-${String(maxNumber + 1).padStart(4, "0")}`;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!form.customerName.trim()) return;
        if (!form.email.trim()) return;
        if (!form.phone.trim()) return;

        const next = {
            customerId: createNextCustomerId(customers),
            customerName: form.customerName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            loyalty: form.loyalty,
        };

        setCustomers([next, ...customers]);
        setIsAddOpen(false);
        setForm({ customerName: "", email: "", phone: "", loyalty: "Bronze" });
    };

    return (
        <div id="customers-container" className="pb-10">
            <PageHeader title="Customers" breadcrumb={["Dashboard", "Customer List"]}>
                <button
                    type="button"
                    onClick={() => setIsAddOpen(true)}
                    className="bg-hijau text-white px-4 py-2 rounded-lg font-bold"
                >
                    Add Customer
                </button>
            </PageHeader>
            <div className="px-5 mt-4">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-teks">Daftar Customer</h2>
                            <p className="text-sm text-gray-400 font-medium">Total data: {customers.length}</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Loyalty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {customers.map((customer) => (
                                    <tr key={customer.customerId} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-sm text-hijau">{customer.customerId}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                                                    {customer.customerName.charAt(0)}
                                                </div>
                                                <span className="text-sm font-bold text-teks">{customer.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{customer.email}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-500">{customer.phone}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${loyaltyClass(customer.loyalty)}`}>
                                                {customer.loyalty}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setIsAddOpen(false)}
                    />
                    <div className="relative w-full max-w-xl mx-4 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-teks">Add Customer</h3>
                                <p className="text-sm text-gray-400 font-medium">Isi form sesuai atribut JSON Customers</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddOpen(false)}
                                className="px-3 py-2 rounded-xl hover:bg-gray-50 font-bold text-gray-400 hover:text-teks transition-colors"
                            >
                                Close
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="p-6 grid grid-cols-1 gap-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-teks">Customer Name</label>
                                    <input
                                        value={form.customerName}
                                        onChange={(e) => setForm((prev) => ({ ...prev, customerName: e.target.value }))}
                                        className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                                        placeholder="Nama customer"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-teks">Loyalty</label>
                                    <select
                                        value={form.loyalty}
                                        onChange={(e) => setForm((prev) => ({ ...prev, loyalty: e.target.value }))}
                                        className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all bg-white"
                                    >
                                        <option value="Bronze">Bronze</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Gold">Gold</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-teks">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                                    className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                                    placeholder="nama@mail.com"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-bold text-teks">Phone</label>
                                <input
                                    value={form.phone}
                                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                                    className="border border-gray-100 p-3 rounded-xl outline-none focus:border-hijau transition-all"
                                    placeholder="08xx-xxxx-xxxx"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="px-5 py-3 rounded-xl font-bold text-gray-500 hover:text-teks hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-hijau text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                                >
                                    Save Customer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
