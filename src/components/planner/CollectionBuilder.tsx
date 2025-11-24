'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useSkus, type SKU } from '@/hooks/useSkus';
import type { SetupData } from '@/types/planner';

interface CollectionBuilderProps {
  setupData: SetupData;
  collectionPlanId: string;
}

export function CollectionBuilder({ setupData, collectionPlanId }: CollectionBuilderProps) {
  const [name, setName] = useState('');
  const [family, setFamily] = useState('');
  const [type, setType] = useState<'REVENUE' | 'IMAGEN' | 'ENTRY'>('REVENUE');
  const [channel, setChannel] = useState<'DTC' | 'WHOLESALE' | 'BOTH'>('DTC');
  const [dropNumber, setDropNumber] = useState(1);
  const [pvp, setPvp] = useState(0);
  const [cost, setCost] = useState(0);
  const [buyUnits, setBuyUnits] = useState(0);
  const [salePercentage, setSalePercentage] = useState(60);
  const [discount, setDiscount] = useState(0);

  const { skus, addSku, updateSku, deleteSku, loading } = useSkus(collectionPlanId);

  // Calculate totals
  const totalExpectedSales = useMemo(() => {
    return skus.reduce((acc, sku) => acc + sku.expected_sales, 0);
  }, [skus]);

  const totalCost = useMemo(() => {
    return skus.reduce((acc, sku) => acc + (sku.cost * sku.buy_units), 0);
  }, [skus]);

  const totalMargin = useMemo(() => {
    return totalExpectedSales - totalCost;
  }, [totalExpectedSales, totalCost]);

  const marginPercentage = useMemo(() => {
    return totalExpectedSales > 0 ? (totalMargin / totalExpectedSales) * 100 : 0;
  }, [totalMargin, totalExpectedSales]);

  const handleAddSku = async () => {
    if (!name || pvp <= 0 || cost <= 0) return;

    const finalPrice = pvp * (1 - discount / 100);
    const expectedSales = (buyUnits * salePercentage / 100) * finalPrice;
    const margin = ((pvp - cost) / pvp) * 100;

    const newSku: Omit<SKU, 'id' | 'created_at' | 'updated_at'> = {
      collection_plan_id: collectionPlanId,
      name,
      family: family || setupData.productFamilies[0]?.name || 'General',
      category: (setupData.productCategory || 'ROPA') as 'CALZADO' | 'ROPA' | 'ACCESORIOS',
      type,
      channel,
      drop_number: dropNumber,
      pvp,
      cost,
      discount,
      final_price: finalPrice,
      buy_units: buyUnits,
      sale_percentage: salePercentage,
      expected_sales: expectedSales,
      margin,
      launch_date: new Date().toISOString().split('T')[0],
    };

    await addSku(newSku);

    // Reset form
    setName('');
    setPvp(0);
    setCost(0);
    setBuyUnits(0);
    setDiscount(0);
  };

  const availableFamilies = setupData.productFamilies?.map(f => f.name) || [];

  return (
    <div className="space-y-6">
      {/* Financial Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>Collection budget and margin analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Cost</p>
              <p className="text-2xl font-bold">€{totalCost.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Expected Sales</p>
              <p className="text-2xl font-bold">€{Math.round(totalExpectedSales).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Margin</p>
              <p className="text-2xl font-bold text-green-600">€{Math.round(totalMargin).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Margin %</p>
              <p className="text-2xl font-bold">{marginPercentage.toFixed(1)}%</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">SKUs Created</span>
              <Badge variant="secondary">{skus.length} / {setupData.expectedSkus}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add SKU Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add New SKU</CardTitle>
          <CardDescription>Create individual products for your collection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Product Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Oversized Bomber Jacket"
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs">Family</Label>
              <Select value={family} onValueChange={setFamily}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {availableFamilies.map((fam) => (
                    <SelectItem key={fam} value={fam}>{fam}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as any)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REVENUE">Revenue</SelectItem>
                  <SelectItem value="IMAGEN">Imagen</SelectItem>
                  <SelectItem value="ENTRY">Entry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Channel</Label>
              <Select value={channel} onValueChange={(v) => setChannel(v as any)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DTC">DTC</SelectItem>
                  <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                  <SelectItem value="BOTH">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Drop #</Label>
              <Input
                type="number"
                value={dropNumber}
                onChange={(e) => setDropNumber(Number(e.target.value))}
                className="h-9"
                min={1}
                max={setupData.dropsCount}
              />
            </div>
            <div>
              <Label className="text-xs">Cost (€)</Label>
              <Input
                type="number"
                value={cost || ''}
                onChange={(e) => setCost(Number(e.target.value))}
                className="h-9"
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-xs">PVP (€)</Label>
              <Input
                type="number"
                value={pvp || ''}
                onChange={(e) => setPvp(Number(e.target.value))}
                className="h-9"
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-xs">Units</Label>
              <Input
                type="number"
                value={buyUnits || ''}
                onChange={(e) => setBuyUnits(Number(e.target.value))}
                className="h-9"
                placeholder="0"
              />
            </div>
            <div>
              <Label className="text-xs">Sale %</Label>
              <Input
                type="number"
                value={salePercentage}
                onChange={(e) => setSalePercentage(Number(e.target.value))}
                className="h-9"
                min={0}
                max={100}
              />
            </div>
            <div>
              <Label className="text-xs">Discount %</Label>
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="h-9"
                min={0}
                max={100}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddSku} 
                disabled={!name || pvp <= 0 || cost <= 0}
                className="h-9 w-full"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SKU Table */}
      <Card>
        <CardHeader>
          <CardTitle>SKU List ({skus.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading SKUs...</p>
          ) : skus.length === 0 ? (
            <p className="text-sm text-muted-foreground">No SKUs yet. Add your first product above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Name</th>
                    <th className="text-left py-2 px-2">Family</th>
                    <th className="text-left py-2 px-2">Type</th>
                    <th className="text-right py-2 px-2">Cost</th>
                    <th className="text-right py-2 px-2">PVP</th>
                    <th className="text-right py-2 px-2">Units</th>
                    <th className="text-right py-2 px-2">Sales</th>
                    <th className="text-right py-2 px-2">Margin %</th>
                    <th className="text-right py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {skus.map((sku) => (
                    <tr key={sku.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2 font-medium">{sku.name}</td>
                      <td className="py-2 px-2">
                        <Badge variant="outline" className="text-xs">{sku.family}</Badge>
                      </td>
                      <td className="py-2 px-2">
                        <Badge variant="secondary" className="text-xs">{sku.type}</Badge>
                      </td>
                      <td className="py-2 px-2 text-right">€{sku.cost}</td>
                      <td className="py-2 px-2 text-right">€{sku.pvp}</td>
                      <td className="py-2 px-2 text-right">{sku.buy_units}</td>
                      <td className="py-2 px-2 text-right font-medium">€{Math.round(sku.expected_sales).toLocaleString()}</td>
                      <td className="py-2 px-2 text-right">
                        <span className={sku.margin >= 50 ? 'text-green-600' : 'text-orange-600'}>
                          {sku.margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSku(sku.id)}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
