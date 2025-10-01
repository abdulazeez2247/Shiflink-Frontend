
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { DatePicker } from '@/components/ui/date-picker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Percent, Calendar, Users, Tag, Copy, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'amount';
  value: number;
  startDate: Date;
  endDate: Date;
  maxUses: number;
  currentUses: number;
  courses: string[];
  isActive: boolean;
  description: string;
}

interface BulkDiscount {
  id: string;
  name: string;
  minStudents: number;
  discountPercentage: number;
  courses: string[];
  isActive: boolean;
}

interface EarlyBirdPricing {
  id: string;
  courseId: string;
  discountPercentage: number;
  earlyBirdEndDate: Date;
  isActive: boolean;
}

const PromotionalTools = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [bulkDiscounts, setBulkDiscounts] = useState<BulkDiscount[]>([]);
  const [earlyBirdPricing, setEarlyBirdPricing] = useState<EarlyBirdPricing[]>([]);
  const [showDiscountDialog, setShowDiscountDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showEarlyBirdDialog, setShowEarlyBirdDialog] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  
  const [discountForm, setDiscountForm] = useState({
    code: '',
    type: 'percentage' as 'percentage' | 'amount',
    value: 0,
    startDate: new Date(),
    endDate: new Date(),
    maxUses: 100,
    description: ''
  });

  const [bulkForm, setBulkForm] = useState({
    name: '',
    minStudents: 5,
    discountPercentage: 10
  });

  const [earlyBirdForm, setEarlyBirdForm] = useState({
    courseId: '',
    discountPercentage: 15,
    earlyBirdEndDate: new Date()
  });

  // Mock courses data - in real app, fetch from API
  const courses = [
    { id: '1', title: 'Healthcare Basics' },
    { id: '2', title: 'Advanced Care Techniques' },
    { id: '3', title: 'Safety Protocols' }
  ];

  useEffect(() => {
    loadPromotionalData();
  }, []);

  const loadPromotionalData = () => {
    // Load from localStorage for demo
    const discounts = localStorage.getItem('discount-codes');
    if (discounts) setDiscountCodes(JSON.parse(discounts));

    const bulk = localStorage.getItem('bulk-discounts');
    if (bulk) setBulkDiscounts(JSON.parse(bulk));

    const earlyBird = localStorage.getItem('early-bird-pricing');
    if (earlyBird) setEarlyBirdPricing(JSON.parse(earlyBird));
  };

  const generateDiscountCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setDiscountForm(prev => ({ ...prev, code: result }));
  };

  const createDiscountCode = () => {
    if (!discountForm.code || !discountForm.value) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newDiscount: DiscountCode = {
      id: crypto.randomUUID(),
      ...discountForm,
      currentUses: 0,
      courses: [], // Could add course selection
      isActive: true
    };

    const updatedDiscounts = [...discountCodes, newDiscount];
    setDiscountCodes(updatedDiscounts);
    localStorage.setItem('discount-codes', JSON.stringify(updatedDiscounts));

    toast({
      title: "Success",
      description: "Discount code created successfully"
    });

    setShowDiscountDialog(false);
    setDiscountForm({
      code: '',
      type: 'percentage',
      value: 0,
      startDate: new Date(),
      endDate: new Date(),
      maxUses: 100,
      description: ''
    });
  };

  const createBulkDiscount = () => {
    if (!bulkForm.name || !bulkForm.minStudents || !bulkForm.discountPercentage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newBulkDiscount: BulkDiscount = {
      id: crypto.randomUUID(),
      ...bulkForm,
      courses: [],
      isActive: true
    };

    const updatedBulkDiscounts = [...bulkDiscounts, newBulkDiscount];
    setBulkDiscounts(updatedBulkDiscounts);
    localStorage.setItem('bulk-discounts', JSON.stringify(updatedBulkDiscounts));

    toast({
      title: "Success",
      description: "Bulk discount created successfully"
    });

    setShowBulkDialog(false);
    setBulkForm({
      name: '',
      minStudents: 5,
      discountPercentage: 10
    });
  };

  const toggleDiscountStatus = (id: string) => {
    const updatedDiscounts = discountCodes.map(discount =>
      discount.id === id ? { ...discount, isActive: !discount.isActive } : discount
    );
    setDiscountCodes(updatedDiscounts);
    localStorage.setItem('discount-codes', JSON.stringify(updatedDiscounts));
  };

  const copyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Discount code copied to clipboard"
    });
  };

  const deleteDiscountCode = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this discount code?')) return;
    
    const updatedDiscounts = discountCodes.filter(d => d.id !== id);
    setDiscountCodes(updatedDiscounts);
    localStorage.setItem('discount-codes', JSON.stringify(updatedDiscounts));
    
    toast({
      title: "Success",
      description: "Discount code deleted"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Promotional Tools</h3>
        <p className="text-gray-600">Create discount codes, bulk pricing, and early bird offers</p>
      </div>

      <Tabs defaultValue="discount-codes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discount-codes">Discount Codes</TabsTrigger>
          <TabsTrigger value="bulk-discounts">Bulk Discounts</TabsTrigger>
          <TabsTrigger value="early-bird">Early Bird</TabsTrigger>
        </TabsList>

        <TabsContent value="discount-codes" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Discount Codes</h4>
                <p className="text-sm text-gray-600">Create and manage promotional discount codes</p>
              </div>
              <Button onClick={() => setShowDiscountDialog(true)} className="bg-medical-blue hover:bg-blue-800">
                <Tag className="w-4 h-4 mr-2" />
                Create Code
              </Button>
            </div>

            {discountCodes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No discount codes yet</h3>
                  <p className="text-gray-500 mb-4">Create your first discount code to boost enrollment</p>
                  <Button onClick={() => setShowDiscountDialog(true)} className="bg-medical-blue hover:bg-blue-800">
                    Create Discount Code
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {discountCodes.map((discount) => (
                  <Card key={discount.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-mono">{discount.code}</CardTitle>
                          <CardDescription>{discount.description}</CardDescription>
                        </div>
                        <Badge variant={discount.isActive ? "default" : "secondary"}>
                          {discount.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Discount</span>
                          <span className="font-medium">
                            {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Uses</span>
                          <span className="font-medium">{discount.currentUses}/{discount.maxUses}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Expires</span>
                          <span className="text-sm">{discount.endDate.toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => copyDiscountCode(discount.code)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleDiscountStatus(discount.id)}
                          >
                            {discount.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteDiscountCode(discount.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bulk-discounts" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Bulk Discounts</h4>
                <p className="text-sm text-gray-600">Offer discounts for group enrollments</p>
              </div>
              <Button onClick={() => setShowBulkDialog(true)} className="bg-medical-blue hover:bg-blue-800">
                <Users className="w-4 h-4 mr-2" />
                Create Bulk Discount
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bulkDiscounts.map((bulk) => (
                <Card key={bulk.id}>
                  <CardHeader>
                    <CardTitle>{bulk.name}</CardTitle>
                    <Badge variant={bulk.isActive ? "default" : "secondary"}>
                      {bulk.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Minimum Students:</span>
                        <span className="font-medium">{bulk.minStudents}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <span className="font-medium">{bulk.discountPercentage}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="early-bird" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Early Bird Pricing</h4>
                <p className="text-sm text-gray-600">Offer special pricing for early enrollments</p>
              </div>
              <Button onClick={() => setShowEarlyBirdDialog(true)} className="bg-medical-blue hover:bg-blue-800">
                <Calendar className="w-4 h-4 mr-2" />
                Create Early Bird
              </Button>
            </div>

            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Early Bird Pricing</h3>
                <p className="text-gray-500">Set up time-limited discounts for early course enrollment</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Discount Code Dialog */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Discount Code</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Discount Code</Label>
              <div className="flex space-x-2">
                <Input
                  id="code"
                  value={discountForm.code}
                  onChange={(e) => setDiscountForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="Enter code"
                />
                <Button type="button" variant="outline" onClick={generateDiscountCode}>
                  Generate
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select 
                  value={discountForm.type} 
                  onValueChange={(value: 'percentage' | 'amount') => setDiscountForm(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="amount">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="value">
                  {discountForm.type === 'percentage' ? 'Percentage (%)' : 'Amount ($)'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  min="0"
                  max={discountForm.type === 'percentage' ? 100 : undefined}
                  value={discountForm.value}
                  onChange={(e) => setDiscountForm(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <DatePicker
                  date={discountForm.startDate}
                  onSelect={(date) => date && setDiscountForm(prev => ({ ...prev, startDate: date }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>End Date</Label>
                <DatePicker
                  date={discountForm.endDate}
                  onSelect={(date) => date && setDiscountForm(prev => ({ ...prev, endDate: date }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxUses">Maximum Uses</Label>
              <Input
                id="maxUses"
                type="number"
                min="1"
                value={discountForm.maxUses}
                onChange={(e) => setDiscountForm(prev => ({ ...prev, maxUses: parseInt(e.target.value) || 1 }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={discountForm.description}
                onChange={(e) => setDiscountForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Internal description"
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowDiscountDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createDiscountCode} className="bg-medical-blue hover:bg-blue-800">
                Create Code
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Discount Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Bulk Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulkName">Discount Name</Label>
              <Input
                id="bulkName"
                value={bulkForm.name}
                onChange={(e) => setBulkForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Group Discount"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minStudents">Minimum Students</Label>
                <Input
                  id="minStudents"
                  type="number"
                  min="2"
                  value={bulkForm.minStudents}
                  onChange={(e) => setBulkForm(prev => ({ ...prev, minStudents: parseInt(e.target.value) || 2 }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bulkDiscount">Discount Percentage</Label>
                <Input
                  id="bulkDiscount"
                  type="number"
                  min="1"
                  max="50"
                  value={bulkForm.discountPercentage}
                  onChange={(e) => setBulkForm(prev => ({ ...prev, discountPercentage: parseInt(e.target.value) || 10 }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                Cancel
              </Button>
              <Button onClick={createBulkDiscount} className="bg-medical-blue hover:bg-blue-800">
                Create Bulk Discount
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionalTools;
