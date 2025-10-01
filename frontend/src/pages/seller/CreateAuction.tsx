import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { useNotifications } from './NotificationContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { categories } from './mockData';
import { 
  Upload, 
  X, 
  Plus, 
  Calendar, 
  Clock, 
  DollarSign,
  Info,
  Camera,
  Tag,
  MapPin
} from 'lucide-react';

interface AuctionForm {
  title: string;
  description: string;
  category: string;
  tags: string[];
  startingBid: string;
  reservePrice: string;
  bidIncrement: string;
  duration: string;
  auctionType: 'standard' | 'flash' | 'sealed';
  location: string;
  images: File[];
}

export function CreateAuction() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<AuctionForm>({
    title: '',
    description: '',
    category: '',
    tags: [],
    startingBid: '',
    reservePrice: '',
    bidIncrement: '',
    duration: '7',
    auctionType: 'standard',
    location: '',
    images: []
  });

  const [newTag, setNewTag] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated || user?.role !== 'seller') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (field: keyof AuctionForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 5) {
      showToast('Maximum 5 images allowed', 'error');
      return;
    }

    const newImages = [...formData.images, ...files];
    setFormData(prev => ({ ...prev, images: newImages }));

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = previewImages.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setPreviewImages(newPreviews);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return false;
    }
    if (!formData.description.trim()) {
      showToast('Description is required', 'error');
      return false;
    }
    if (!formData.category) {
      showToast('Category is required', 'error');
      return false;
    }
    if (!formData.startingBid || parseFloat(formData.startingBid) <= 0) {
      showToast('Valid starting bid is required', 'error');
      return false;
    }
    if (!formData.bidIncrement || parseFloat(formData.bidIncrement) <= 0) {
      showToast('Valid bid increment is required', 'error');
      return false;
    }
    if (formData.reservePrice && parseFloat(formData.reservePrice) < parseFloat(formData.startingBid)) {
      showToast('Reserve price must be greater than starting bid', 'error');
      return false;
    }
    if (formData.images.length === 0) {
      showToast('At least one image is required', 'error');
      return false;
    }
    if (!formData.location.trim()) {
      showToast('Location is required', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      showToast('Auction created successfully! Pending admin approval.', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast('Failed to create auction. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    return isNaN(num) ? 'ETB 0' : new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const ethiopianCities = [
    'Addis Ababa', 'Dire Dawa', 'Bahir Dar', 'Gondar', 'Hawassa', 
    'Mekelle', 'Jimma', 'Adama', 'Dessie', 'Harar'
  ];

  const durationOptions = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '7', label: '1 Week' },
    { value: '14', label: '2 Weeks' },
    { value: '30', label: '1 Month' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('nav.create_auction')}</h1>
          <p className="text-gray-600">
            Create a new auction listing for your item
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Details</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Duration</TabsTrigger>
              <TabsTrigger value="media">Images & Tags</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide the essential details about your auction item
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('auction.title')} *</Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title for your item"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500">{formData.title.length}/100 characters</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t('auction.description')} *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item in detail. Include condition, age, features, etc."
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={6}
                      maxLength={2000}
                    />
                    <p className="text-xs text-gray-500">{formData.description.length}/2000 characters</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">{t('auction.category')} *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              <div className="flex items-center space-x-2">
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {ethiopianCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Duration</CardTitle>
                  <CardDescription>
                    Set your auction pricing and duration settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startingBid">Starting Bid (ETB) *</Label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="startingBid"
                          type="number"
                          placeholder="0"
                          value={formData.startingBid}
                          onChange={(e) => handleInputChange('startingBid', e.target.value)}
                          className="pl-10"
                          min="1"
                        />
                      </div>
                      {formData.startingBid && (
                        <p className="text-xs text-gray-500">
                          {formatCurrency(formData.startingBid)}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bidIncrement">Bid Increment (ETB) *</Label>
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          id="bidIncrement"
                          type="number"
                          placeholder="0"
                          value={formData.bidIncrement}
                          onChange={(e) => handleInputChange('bidIncrement', e.target.value)}
                          className="pl-10"
                          min="1"
                        />
                      </div>
                      {formData.bidIncrement && (
                        <p className="text-xs text-gray-500">
                          {formatCurrency(formData.bidIncrement)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reservePrice">Reserve Price (ETB) - Optional</Label>
                    <div className="relative">
                      <DollarSign size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <Input
                        id="reservePrice"
                        type="number"
                        placeholder="0"
                        value={formData.reservePrice}
                        onChange={(e) => handleInputChange('reservePrice', e.target.value)}
                        className="pl-10"
                        min="1"
                      />
                    </div>
                    {formData.reservePrice && (
                      <p className="text-xs text-gray-500">
                        {formatCurrency(formData.reservePrice)}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      <Info size={12} className="inline mr-1" />
                      Reserve price is the minimum price you're willing to accept
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Auction Duration</Label>
                      <Select value={formData.duration} onValueChange={(value) => handleInputChange('duration', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="auctionType">Auction Type</Label>
                      <Select 
                        value={formData.auctionType} 
                        onValueChange={(value: 'standard' | 'flash' | 'sealed') => handleInputChange('auctionType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">
                            <div>
                              <div className="font-medium">Standard Auction</div>
                              <div className="text-xs text-gray-500">Regular bidding process</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="flash">
                            <div>
                              <div className="font-medium">Flash Sale</div>
                              <div className="text-xs text-gray-500">Quick sale with time pressure</div>
                            </div>
                          </SelectItem>
                          <SelectItem value="sealed">
                            <div>
                              <div className="font-medium">Sealed Bids</div>
                              <div className="text-xs text-gray-500">Hidden bids until end</div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                  <CardDescription>
                    Upload high-quality images of your item (maximum 5 images)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={formData.images.length >= 5}
                    />
                    <label 
                      htmlFor="image-upload" 
                      className={`cursor-pointer ${formData.images.length >= 5 ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Click to upload images
                      </p>
                      <p className="text-sm text-gray-500">
                        PNG, JPG, JPEG up to 10MB each
                      </p>
                    </label>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {previewImages.map((preview, index) => (
                        <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                          <img 
                            src={preview} 
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2" variant="secondary">
                              Primary
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>
                    Add tags to help buyers find your item (maximum 5 tags)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        disabled={formData.tags.length >= 5}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!newTag.trim() || formData.tags.length >= 5}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleRemoveTag(tag)}
                          >
                            <X size={12} />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Auction...' : 'Create Auction'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}