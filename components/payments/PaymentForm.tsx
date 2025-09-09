'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Calendar,
  User
} from 'lucide-react';

const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'wire_transfer']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional(),
  bankAccount: z.string().optional(),
  routingNumber: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  dealId: string;
  amount: number;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

export function PaymentForm({ dealId, amount, onSuccess, onCancel }: PaymentFormProps) {
  const [step, setStep] = useState<'details' | 'confirmation' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'bank_transfer' | 'wire_transfer'>('credit_card');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount,
      paymentMethod: 'credit_card',
    },
  });

  const watchedAmount = watch('amount');

  const onSubmit = async (data: PaymentFormData) => {
    setStep('confirmation');
  };

  const processPayment = async () => {
    setStep('processing');
    setProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate success/failure (90% success rate for demo)
      const success = Math.random() > 0.1;
      
      if (success) {
        setStep('success');
        setTimeout(() => {
          onSuccess(`payment_${Date.now()}`);
        }, 2000);
      } else {
        setError('Payment failed. Please try again or use a different payment method.');
        setStep('details');
      }
    } catch (err) {
      setError('An error occurred while processing your payment. Please try again.');
      setStep('details');
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const maskCardNumber = (cardNumber: string) => {
    return cardNumber.replace(/\d(?=\d{4})/g, '*');
  };

  if (step === 'success') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">
            Your payment of {formatCurrency(watchedAmount)} has been processed successfully.
          </p>
          <p className="text-sm text-gray-500">
            You will receive a confirmation email shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'processing') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Payment</h3>
          <p className="text-gray-600">
            Please don&apos;t close this page while we process your payment.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'confirmation') {
    const formData = watch();
    
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Confirm Payment</CardTitle>
          <CardDescription className="text-center">
            Review your payment details before proceeding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Amount:</span>
              <span className="text-xl font-bold text-green-600">
                {formatCurrency(formData.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Payment Method:</span>
              <span className="capitalize">
                {formData.paymentMethod?.replace('_', ' ')}
              </span>
            </div>
            {formData.paymentMethod === 'credit_card' && formData.cardNumber && (
              <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                <span>Card:</span>
                <span>{maskCardNumber(formData.cardNumber)}</span>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setStep('details')}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={processPayment}
              disabled={processing}
              className="flex-1"
            >
              {processing ? 'Processing...' : 'Confirm Payment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Make Payment</CardTitle>
        <CardDescription className="text-center">
          Secure payment processing for your investment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                className="pl-10"
                placeholder="0.00"
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="space-y-2">
              {[
                { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
                { value: 'bank_transfer', label: 'Bank Transfer', icon: User },
                { value: 'wire_transfer', label: 'Wire Transfer', icon: Calendar },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    paymentMethod === method.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value as any);
                      setValue('paymentMethod', e.target.value as any);
                    }}
                    className="text-blue-600"
                  />
                  <method.icon className="w-5 h-5 ml-3 text-gray-600" />
                  <span className="ml-2 font-medium">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Credit Card Details */}
          {paymentMethod === 'credit_card' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  {...register('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-red-600">{errors.cardNumber.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    {...register('expiryDate')}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                  {errors.expiryDate && (
                    <p className="text-sm text-red-600">{errors.expiryDate.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    {...register('cvv')}
                    placeholder="123"
                    maxLength={4}
                  />
                  {errors.cvv && (
                    <p className="text-sm text-red-600">{errors.cvv.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  {...register('cardholderName')}
                  placeholder="John Doe"
                />
                {errors.cardholderName && (
                  <p className="text-sm text-red-600">{errors.cardholderName.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Bank Transfer Details */}
          {paymentMethod === 'bank_transfer' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankAccount">Account Number</Label>
                <Input
                  id="bankAccount"
                  {...register('bankAccount')}
                  placeholder="1234567890"
                />
                {errors.bankAccount && (
                  <p className="text-sm text-red-600">{errors.bankAccount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="routingNumber">Routing Number</Label>
                <Input
                  id="routingNumber"
                  {...register('routingNumber')}
                  placeholder="123456789"
                />
                {errors.routingNumber && (
                  <p className="text-sm text-red-600">{errors.routingNumber.message}</p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              {...register('notes')}
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Security Notice */}
          <div className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
            <Lock className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-medium">Secure Payment</p>
              <p>Your payment information is encrypted and secure.</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              Continue to Payment
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

