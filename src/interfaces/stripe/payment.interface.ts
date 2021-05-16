export interface IPayment{
    amount: string | number;
    description: String;
    customer: string;
    currency: string;
    token?: string;
}