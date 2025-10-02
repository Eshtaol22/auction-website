import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ArrowLeft, Scale, Shield, AlertTriangle } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">Terms & Conditions</span>
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-gray-600">Last updated: March 2024</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale size={20} className="mr-2" />
                Bidding Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">1. Bid Commitment</h3>
                <p className="text-gray-700">
                  By placing a bid, you enter into a legally binding commitment. All bids are final and cannot be cancelled once submitted.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">2. Payment Obligations</h3>
                <p className="text-gray-700">
                  Winning bidders must complete payment within 48 hours of auction end. Failure to pay may result in account suspension and legal action.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">3. Minimum Bid Increments</h3>
                <p className="text-gray-700">
                  All bids must meet or exceed the minimum bid increment specified for each auction.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield size={20} className="mr-2" />
                Platform Fees & Escrow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">4. Service Fees</h3>
                <p className="text-gray-700">
                  A platform fee of 2.5% applies to all successful bids. This fee covers transaction processing, escrow services, and buyer protection.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">5. Escrow Protection</h3>
                <p className="text-gray-700">
                  Bid amounts are held in secure escrow until auction completion. Funds are automatically refunded if outbid.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">6. KYC Requirements</h3>
                <p className="text-gray-700">
                  All users must complete KYC verification for bids above ETB 50,000 in accordance with Ethiopian financial regulations.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle size={20} className="mr-2" />
                Important Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">7. Item Conditions</h3>
                <p className="text-gray-700">
                  All items are sold "as is" based on seller descriptions. Buyers should review all details and ask questions before bidding.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">8. Dispute Resolution</h3>
                <p className="text-gray-700">
                  Disputes are resolved through our internal mediation process. Ethiopian law governs all transactions.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">9. Account Suspension</h3>
                <p className="text-gray-700">
                  Failure to honor bids, fraudulent activity, or violation of terms may result in immediate account suspension.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="font-medium mb-2">Contact Information</h3>
            <p className="text-gray-700 mb-4">
              If you have questions about these terms, please contact our support team:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Email: support@ethiopianauctions.et</li>
              <li>• Phone: +251-11-XXX-XXXX</li>
              <li>• Address: Addis Ababa, Ethiopia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}