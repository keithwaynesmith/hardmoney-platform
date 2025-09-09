'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  DollarSign, 
  User, 
  FileText,
  CheckCircle,
  Upload,
  MapPin,
  Calendar
} from 'lucide-react';
import { DocumentManager } from '@/components/documents/DocumentManager';

// Step 1: Property Details
const propertySchema = z.object({
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyCity: z.string().min(1, 'City is required'),
  propertyState: z.string().min(1, 'State is required'),
  propertyZip: z.string().min(5, 'Valid ZIP code is required'),
  propertyType: z.enum(['single_family', 'multi_family', 'commercial', 'land', 'other']),
  purchasePrice: z.number().min(1, 'Purchase price must be greater than 0'),
  arv: z.number().min(1, 'ARV must be greater than 0'),
});

// Step 2: Loan Details
const loanSchema = z.object({
  loanAmount: z.number().min(1, 'Loan amount must be greater than 0'),
  loanPurpose: z.enum(['purchase', 'refinance', 'construction', 'bridge']),
  timeline: z.number().min(1, 'Timeline must be at least 1 month'),
  exitStrategy: z.string().min(10, 'Please provide a detailed exit strategy'),
});

// Step 3: Borrower Information
const borrowerSchema = z.object({
  borrowerExperience: z.string().min(10, 'Please describe your real estate experience'),
  financialDetails: z.string().min(10, 'Please provide financial details'),
  creditScore: z.number().min(300).max(850).optional(),
  annualIncome: z.number().min(1).optional(),
});

// Combined schema
const fullSchema = propertySchema.merge(loanSchema).merge(borrowerSchema);

type FormData = z.infer<typeof fullSchema>;

interface LoanApplicationFormProps {
  onSuccess?: (data: FormData) => void;
  onCancel?: () => void;
}

const steps = [
  { id: 1, title: 'Property Details', icon: Home, description: 'Tell us about the property' },
  { id: 2, title: 'Loan Details', icon: DollarSign, description: 'Specify your loan needs' },
  { id: 3, title: 'Borrower Info', icon: User, description: 'Your experience and finances' },
  { id: 4, title: 'Documents', icon: FileText, description: 'Upload required documents' },
];

export default function LoanApplicationForm({ onSuccess, onCancel }: LoanApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(fullSchema),
    mode: 'onChange',
  });

  const watchedValues = watch();

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['propertyAddress', 'propertyCity', 'propertyState', 'propertyZip', 'propertyType', 'purchasePrice', 'arv'];
        break;
      case 2:
        fieldsToValidate = ['loanAmount', 'loanPurpose', 'timeline', 'exitStrategy'];
        break;
      case 3:
        fieldsToValidate = ['borrowerExperience', 'financialDetails'];
        break;
    }

    const isValidStep = await trigger(fieldsToValidate);
    if (isValidStep) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess?.(data);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStepValidation = (step: number) => {
    switch (step) {
      case 1:
        return !errors.propertyAddress && !errors.propertyCity && !errors.propertyState && 
               !errors.propertyZip && !errors.propertyType && !errors.purchasePrice && !errors.arv &&
               watchedValues.propertyAddress && watchedValues.propertyCity && watchedValues.propertyState &&
               watchedValues.propertyZip && watchedValues.propertyType && watchedValues.purchasePrice && watchedValues.arv;
      case 2:
        return !errors.loanAmount && !errors.loanPurpose && !errors.timeline && !errors.exitStrategy &&
               watchedValues.loanAmount && watchedValues.loanPurpose && watchedValues.timeline && watchedValues.exitStrategy;
      case 3:
        return !errors.borrowerExperience && !errors.financialDetails &&
               watchedValues.borrowerExperience && watchedValues.financialDetails;
      case 4:
        return uploadedFiles.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl">
      {/* Progress Header */}
      <div className="px-8 py-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Loan Application</h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isValid = getStepValidation(step.id);
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  isCompleted || isValid
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'bg-blue-500 border-blue-500 text-white'
                    : 'border-slate-300 text-slate-400'
                }`}>
                  {isCompleted || isValid ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <div className="ml-3">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted || isValid ? 'text-green-600' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-slate-400">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    isCompleted || isValid ? 'bg-green-500' : 'bg-slate-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Home className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Property Details</h3>
                  <p className="text-slate-600">Tell us about the property you&apos;re looking to finance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Address *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    {...register('propertyAddress')}
                    type="text"
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main Street"
                  />
                </div>
                {errors.propertyAddress && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyAddress.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  City *
                </label>
                <input
                  {...register('propertyCity')}
                  type="text"
                  className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="New York"
                />
                {errors.propertyCity && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyCity.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  State *
                </label>
                <select
                  {...register('propertyState')}
                  className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select State</option>
                  <option value="NY">New York</option>
                  <option value="CA">California</option>
                  <option value="TX">Texas</option>
                  <option value="FL">Florida</option>
                  <option value="IL">Illinois</option>
                </select>
                {errors.propertyState && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyState.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  {...register('propertyZip')}
                  type="text"
                  className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="10001"
                />
                {errors.propertyZip && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyZip.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Type *
                </label>
                <select
                  {...register('propertyType')}
                  className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="single_family">Single Family</option>
                  <option value="multi_family">Multi Family</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                  <option value="other">Other</option>
                </select>
                {errors.propertyType && (
                  <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Purchase Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    {...register('purchasePrice', { valueAsNumber: true })}
                    type="number"
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="500000"
                  />
                </div>
                {errors.purchasePrice && (
                  <p className="mt-1 text-sm text-red-600">{errors.purchasePrice.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  After Repair Value (ARV) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    {...register('arv', { valueAsNumber: true })}
                    type="number"
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="650000"
                  />
                </div>
                {errors.arv && (
                  <p className="mt-1 text-sm text-red-600">{errors.arv.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <DollarSign className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Loan Details</h3>
              <p className="text-slate-600">Specify your loan requirements and timeline</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Loan Amount Requested *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    {...register('loanAmount', { valueAsNumber: true })}
                    type="number"
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="400000"
                  />
                </div>
                {errors.loanAmount && (
                  <p className="mt-1 text-sm text-red-600">{errors.loanAmount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Loan Purpose *
                </label>
                <select
                  {...register('loanPurpose')}
                  className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Purpose</option>
                  <option value="purchase">Purchase</option>
                  <option value="refinance">Refinance</option>
                  <option value="construction">Construction</option>
                  <option value="bridge">Bridge Loan</option>
                </select>
                {errors.loanPurpose && (
                  <p className="mt-1 text-sm text-red-600">{errors.loanPurpose.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Timeline (Months) *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                  <input
                    {...register('timeline', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    max="24"
                    className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="12"
                  />
                </div>
                {errors.timeline && (
                  <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Exit Strategy *
                </label>
                <textarea
                  {...register('exitStrategy')}
                  rows={4}
                  className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your plan for repaying the loan (e.g., sell property, refinance, etc.)"
                />
                {errors.exitStrategy && (
                  <p className="mt-1 text-sm text-red-600">{errors.exitStrategy.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <User className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Borrower Information</h3>
              <p className="text-slate-600">Tell us about your experience and financial situation</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Real Estate Experience *
                </label>
                <textarea
                  {...register('borrowerExperience')}
                  rows={4}
                  className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your experience with real estate investments, including number of deals completed, types of properties, etc."
                />
                {errors.borrowerExperience && (
                  <p className="mt-1 text-sm text-red-600">{errors.borrowerExperience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Financial Details *
                </label>
                <textarea
                  {...register('financialDetails')}
                  rows={4}
                  className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Provide details about your financial situation, including income sources, assets, liabilities, etc."
                />
                {errors.financialDetails && (
                  <p className="mt-1 text-sm text-red-600">{errors.financialDetails.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Credit Score (Optional)
                  </label>
                  <input
                    {...register('creditScore', { valueAsNumber: true })}
                    type="number"
                    min="300"
                    max="850"
                    className="w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="750"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Annual Income (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <input
                      {...register('annualIncome', { valueAsNumber: true })}
                      type="number"
                      className="w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="100000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Document Upload</h3>
              <p className="text-slate-600">Upload required documents to complete your application</p>
            </div>

            <DocumentManager
              dealId="temp-deal-id" // This should be the actual deal ID when creating a deal
              onDocumentsChange={(docs) => {
                // Handle document changes
                console.log('Documents updated:', docs);
              }}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-3 text-slate-600 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={!getStepValidation(currentStep)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !getStepValidation(currentStep)}
              className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
