'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Percent,
  Calendar,
  Target
} from 'lucide-react';

interface InvestmentCalculation {
  principal: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  totalInterest: number;
  totalReturn: number;
  annualizedReturn: number;
}

export function InvestmentCalculator() {
  const [calculation, setCalculation] = useState<InvestmentCalculation>({
    principal: 100000,
    interestRate: 12,
    term: 12,
    monthlyPayment: 0,
    totalInterest: 0,
    totalReturn: 0,
    annualizedReturn: 0,
  });

  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const presetAmounts = [25000, 50000, 100000, 250000, 500000, 1000000];

  useEffect(() => {
    calculateInvestment();
  }, [calculation.principal, calculation.interestRate, calculation.term]);

  const calculateInvestment = () => {
    const { principal, interestRate, term } = calculation;
    
    // Simple interest calculation for hard money loans
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                          (Math.pow(1 + monthlyRate, term) - 1);
    
    const totalInterest = (monthlyPayment * term) - principal;
    const totalReturn = principal + totalInterest;
    const annualizedReturn = (Math.pow(totalReturn / principal, 12 / term) - 1) * 100;

    setCalculation(prev => ({
      ...prev,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalReturn: Math.round(totalReturn * 100) / 100,
      annualizedReturn: Math.round(annualizedReturn * 100) / 100,
    }));
  };

  const handlePresetAmount = (amount: number) => {
    setCalculation(prev => ({ ...prev, principal: amount }));
    setShowCustom(false);
  };

  const handleCustomAmount = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) {
      setCalculation(prev => ({ ...prev, principal: amount }));
      setShowCustom(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (rate: number) => {
    return `${rate}%`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Investment Calculator
          </CardTitle>
          <CardDescription>
            Calculate potential returns on your hard money investment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Investment Amount */}
          <div className="space-y-4">
            <Label className="text-lg font-medium">Investment Amount</Label>
            
            {/* Preset Amounts */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant={calculation.principal === amount ? 'default' : 'outline'}
                  onClick={() => handlePresetAmount(amount)}
                  className="justify-start"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  {formatCurrency(amount)}
                </Button>
              ))}
              <Button
                variant={showCustom ? 'default' : 'outline'}
                onClick={() => setShowCustom(!showCustom)}
                className="justify-start"
              >
                <Target className="w-4 h-4 mr-2" />
                Custom
              </Button>
            </div>

            {/* Custom Amount Input */}
            {showCustom && (
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCustomAmount}>
                  Apply
                </Button>
              </div>
            )}
          </div>

          {/* Interest Rate */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Interest Rate</Label>
              <span className="text-2xl font-bold text-blue-600">
                {formatPercentage(calculation.interestRate)}
              </span>
            </div>
            <Slider
              value={[calculation.interestRate]}
              onValueChange={(value) => setCalculation(prev => ({ ...prev, interestRate: value[0] }))}
              min={6}
              max={18}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>6%</span>
              <span>18%</span>
            </div>
          </div>

          {/* Loan Term */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Loan Term</Label>
              <span className="text-2xl font-bold text-green-600">
                {calculation.term} months
              </span>
            </div>
            <Slider
              value={[calculation.term]}
              onValueChange={(value) => setCalculation(prev => ({ ...prev, term: value[0] }))}
              min={3}
              max={36}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>3 months</span>
              <span>36 months</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Payment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(calculation.monthlyPayment)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Interest</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(calculation.totalInterest)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Percent className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Return</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(calculation.totalReturn)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Annualized Return</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(calculation.annualizedReturn)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Summary</CardTitle>
          <CardDescription>
            Detailed breakdown of your potential investment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Principal Investment</span>
              <span className="font-bold">{formatCurrency(calculation.principal)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Interest Rate (Annual)</span>
              <span className="font-bold">{formatPercentage(calculation.interestRate)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Loan Term</span>
              <span className="font-bold">{calculation.term} months</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Monthly Payment</span>
              <span className="font-bold">{formatCurrency(calculation.monthlyPayment)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="font-medium">Total Interest Earned</span>
              <span className="font-bold text-green-600">{formatCurrency(calculation.totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center py-2 bg-gray-50 p-4 rounded-lg">
              <span className="text-lg font-bold">Total Return</span>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(calculation.totalReturn)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

