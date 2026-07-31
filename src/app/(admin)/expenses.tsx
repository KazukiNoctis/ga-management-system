import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';
import { Expense } from '@/types';


type ExpenseWithUser = Expense & {
  profiles: { full_name: string } | null;
};

export default function ExpenseTracking() {
  const [expenses, setExpenses] = useState<ExpenseWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExpenses(data as any || []);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  const totalBudget = 45000;
  const actualExpenditure = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);
  const remaining = totalBudget - actualExpenditure;

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="max-w-[1440px] mx-auto w-full p-8">
        
        {/* Header Section */}
        <View className="flex-row justify-between items-end mb-8">
          <View>
            <Text className="text-[32px] font-bold text-primary mb-1">Expense Tracking</Text>
            <Text className="text-[14px] text-secondary">Manage and audit company-wide operational expenditures.</Text>
          </View>
          <View className="flex-row gap-3">
            <Pressable className="bg-surface-container-lowest border border-outline px-4 py-2 rounded-lg flex-row items-center gap-2 hover:bg-surface-container-low">
              <MaterialIcons name="filter-list" size={18} color="#00236f" />
              <Text className="text-primary font-bold text-[12px]">Filter</Text>
            </Pressable>
            <Pressable className="bg-surface-container-lowest border border-outline px-4 py-2 rounded-lg flex-row items-center gap-2 hover:bg-surface-container-low">
              <MaterialIcons name="download" size={18} color="#00236f" />
              <Text className="text-primary font-bold text-[12px]">Export CSV</Text>
            </Pressable>
          </View>
        </View>

        {/* Summary Cards: Bento Grid Style */}
        <View className="flex-row flex-wrap gap-6 mb-8">
          {/* Monthly Budget Card */}
          <View className="flex-1 min-w-[250px] bg-white p-6 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden group">
            <View className="flex-row justify-between items-start mb-4">
              <View className="bg-primary-container/10 p-2 rounded-lg">
                <MaterialIcons name="account-balance-wallet" size={24} color="#00236f" />
              </View>
              <View className="bg-emerald-50 px-2 py-1 rounded flex-row items-center gap-1">
                <MaterialIcons name="trending-up" size={14} color="#059669" />
                <Text className="text-[12px] font-bold text-emerald-600">+2.4%</Text>
              </View>
            </View>
            <Text className="text-[12px] text-secondary uppercase tracking-wider mb-1">Total Monthly Budget</Text>
            <Text className="text-[24px] font-bold text-on-surface">${totalBudget.toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
            <View className="mt-4 h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
              <View className="bg-primary h-full rounded-full" style={{ width: '100%' }} />
            </View>
          </View>

          {/* Actual Spend Card */}
          <View className="flex-1 min-w-[250px] bg-white p-6 rounded-xl border border-outline-variant shadow-sm relative overflow-hidden group">
            <View className="flex-row justify-between items-start mb-4">
              <View className="bg-secondary-container/20 p-2 rounded-lg">
                <MaterialIcons name="payments" size={24} color="#505f76" />
              </View>
              <View className="bg-amber-50 px-2 py-1 rounded flex-row items-center gap-1">
                <MaterialIcons name="info" size={14} color="#d97706" />
                <Text className="text-[12px] font-bold text-amber-600">On Track</Text>
              </View>
            </View>
            <Text className="text-[12px] text-secondary uppercase tracking-wider mb-1">Actual Expenditure</Text>
            <Text className="text-[24px] font-bold text-on-surface">${actualExpenditure.toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
            <View className="mt-4 h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
              <View className="bg-secondary h-full rounded-full" style={{ width: `${Math.min(100, (actualExpenditure / totalBudget) * 100)}%` }} />
            </View>
          </View>

          {/* Remaining & Variance Card */}
          <View className="flex-1 min-w-[250px] bg-primary-container p-6 rounded-xl border border-outline-variant shadow-sm">
            <View className="flex-row justify-between items-start mb-4">
              <View className="bg-white/20 p-2 rounded-lg">
                <MaterialIcons name="savings" size={24} color="#ffffff" />
              </View>
            </View>
            <Text className="text-[12px] text-white/80 uppercase tracking-wider mb-1">Remaining Balance</Text>
            <Text className="text-[24px] font-bold text-white">${remaining.toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
            <Text className="text-[12px] text-white/70 mt-4">Variance is within safe operational margins.</Text>
          </View>
        </View>

        {/* Data Table Section */}
        <View className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden mb-8">
          <View className="p-6 border-b border-outline-variant flex-row justify-between items-center bg-surface-container-lowest">
            <Text className="text-[20px] font-bold text-on-surface">Recent Expenses</Text>
            <View className="flex-row items-center gap-4">
              <Text className="text-[12px] text-secondary">Showing {Math.min(10, expenses.length)} of {expenses.length} transactions</Text>
              <View className="flex-row gap-1">
                <Pressable className="p-1 rounded hover:bg-surface-container-low">
                  <MaterialIcons name="chevron-left" size={20} color="#191c1e" />
                </Pressable>
                <Pressable className="p-1 rounded hover:bg-surface-container-low">
                  <MaterialIcons name="chevron-right" size={20} color="#191c1e" />
                </Pressable>
              </View>
            </View>
          </View>

          {/* Table Header */}
          <View className="flex-row bg-surface-container-low/50 px-6 py-4">
            <Text className="flex-[2] text-[12px] font-bold text-secondary uppercase">Item Name</Text>
            <Text className="flex-[1] text-[12px] font-bold text-secondary uppercase">Branch</Text>
            <Text className="flex-[1] text-[12px] font-bold text-secondary uppercase">Date</Text>
            <Text className="flex-[1] text-[12px] font-bold text-secondary uppercase text-right px-4">Amount</Text>
            <Text className="flex-[1.5] text-[12px] font-bold text-secondary uppercase">Submitter</Text>
            <Text className="flex-[1] text-[12px] font-bold text-secondary uppercase">Status</Text>
          </View>

          {/* Table Rows */}
          {expenses.length === 0 ? (
             <View className="py-8 items-center justify-center border-b border-outline-variant">
               <Text className="text-secondary text-[14px]">No expenses found</Text>
             </View>
          ) : (
            expenses.slice(0,10).map((expense, index) => (
              <View 
                key={expense.id}
                className={`flex-row items-center py-4 px-6 hover:bg-surface-container-low ${
                  index !== expenses.length - 1 ? 'border-b border-outline-variant' : ''
                }`}
              >
                <View className="flex-[2] flex-row items-center gap-3 pr-4">
                  <View className="w-10 h-10 rounded bg-slate-100 items-center justify-center">
                    <MaterialIcons name="receipt" size={20} color="#64748b" />
                  </View>
                  <View>
                    <Text className="font-bold text-[14px] text-on-surface">{expense.title}</Text>
                    <Text className="text-[12px] text-secondary">Asset ID: {expense.id.substring(0,8)}</Text>
                  </View>
                </View>

                <View className="flex-[1] justify-center pr-4">
                  <Text className="text-[14px] text-on-surface">{expense.branch_id}</Text>
                </View>

                <View className="flex-[1] justify-center pr-4">
                  <Text className="text-[14px] text-on-surface">{new Date(expense.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</Text>
                </View>

                <View className="flex-[1] justify-center px-4">
                  <Text className="font-bold text-[14px] text-on-surface text-right">${Number(expense.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</Text>
                </View>

                <View className="flex-[1.5] flex-row items-center gap-2 pr-4">
                  <View className="w-6 h-6 rounded-full bg-secondary-container items-center justify-center">
                    <Text className="font-bold text-[10px] text-on-surface">
                      {expense.profiles?.full_name ? expense.profiles.full_name.substring(0,2).toUpperCase() : 'U'}
                    </Text>
                  </View>
                  <Text className="text-[14px] text-on-surface">{expense.profiles?.full_name || 'Unknown'}</Text>
                </View>

                <View className="flex-[1] justify-center">
                   <View className="self-start px-2.5 py-0.5 rounded-full bg-emerald-100">
                     <Text className="text-[12px] font-bold text-emerald-700">Completed</Text>
                   </View>
                </View>
              </View>
            ))
          )}
          
          <View className="p-4 border-t border-outline-variant bg-surface-container-low/30 items-center">
            <Text className="text-primary font-bold text-[12px] hover:underline">View All Historical Transactions</Text>
          </View>
        </View>

        {/* Contextual Insights Section */}
        <View className="flex-col lg:flex-row gap-8 mb-8">
          <View className="lg:flex-1 bg-white p-6 rounded-xl border border-outline-variant shadow-sm">
            <Text className="text-[20px] font-bold text-on-surface mb-6">Expense by Category</Text>
            <View className="gap-4">
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-[12px]">Fixed Costs</Text>
                  <Text className="text-[12px] font-bold">45%</Text>
                </View>
                <View className="h-2 w-full bg-surface-container-low rounded-full">
                  <View className="h-full bg-primary rounded-full" style={{ width: '45%' }} />
                </View>
              </View>
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-[12px]">Hardware & IT</Text>
                  <Text className="text-[12px] font-bold">30%</Text>
                </View>
                <View className="h-2 w-full bg-surface-container-low rounded-full">
                  <View className="h-full bg-secondary rounded-full" style={{ width: '30%' }} />
                </View>
              </View>
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-[12px]">Operations</Text>
                  <Text className="text-[12px] font-bold">15%</Text>
                </View>
                <View className="h-2 w-full bg-surface-container-low rounded-full">
                  <View className="h-full bg-[#54647a] rounded-full" style={{ width: '15%' }} />
                </View>
              </View>
              <View>
                <View className="flex-row justify-between mb-1">
                  <Text className="text-[12px]">Travel & Misc</Text>
                  <Text className="text-[12px] font-bold">10%</Text>
                </View>
                <View className="h-2 w-full bg-surface-container-low rounded-full">
                  <View className="h-full bg-outline rounded-full" style={{ width: '10%' }} />
                </View>
              </View>
            </View>
          </View>

          <View className="lg:flex-1 bg-white p-6 rounded-xl border border-outline-variant shadow-sm justify-between">
            <View>
              <Text className="text-[20px] font-bold text-on-surface mb-2">Budget Forecast</Text>
              <Text className="text-[14px] text-secondary mb-6">Based on current spending patterns, you are projected to finish the month with a $4,200 surplus.</Text>
            </View>
            <View className="flex-row items-center gap-6">
              <View className="flex-1">
                <Text className="text-[12px] text-secondary uppercase mb-1">Predicted Total</Text>
                <Text className="text-[24px] font-bold text-emerald-600">$40,800.00</Text>
              </View>
              <View className="h-24 w-24 relative items-center justify-center">
                 <View className="w-20 h-20 rounded-full border-[8px] border-emerald-500 border-r-surface-container-low items-center justify-center">
                    <Text className="font-bold text-emerald-700 text-[14px]">80%</Text>
                 </View>
              </View>
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}
