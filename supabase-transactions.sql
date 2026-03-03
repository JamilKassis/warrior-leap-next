-- ============================================================
-- Transactions table for Warrior Leap Finance Management
-- Run this in Supabase SQL Editor
-- ============================================================

-- Create the transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sale', 'supplier', 'shipping', 'marketing', 'supplies', 'refund', 'other')),
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions (category);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_transactions_updated_at();

-- RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete transactions"
  ON transactions FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- Seed data from Balance.xlsx (19 transactions)
-- Dates are approximate — adjust as needed.
-- Running balance should end at -$9.
-- ============================================================

INSERT INTO transactions (transaction_date, description, category, type, amount, notes) VALUES
  ('2025-01-05', 'Cold Therapy System Sale', 'sale', 'income', 1800.00, 'Sale'),
  ('2025-01-08', 'Cold Therapy System Sale', 'sale', 'income', 1700.00, 'Sale'),
  ('2025-01-12', 'Cold Therapy System Sale', 'sale', 'income', 2000.00, 'Sale'),
  ('2025-01-15', 'Cold Therapy System Sale', 'sale', 'income', 1700.00, 'Sale'),
  ('2025-01-18', 'First Installment Payment', 'supplier', 'expense', 1600.00, NULL),
  ('2025-01-20', 'First Installment Refund', 'refund', 'income', 1552.00, 'Fee deducted from supplier for refund'),
  ('2025-01-22', 'Marketing Expense (Google Ads)', 'marketing', 'expense', 378.00, 'Google Ads'),
  ('2025-01-25', 'Payment Supplier', 'supplier', 'expense', 5440.00, 'Overpaid by $50'),
  ('2025-01-28', 'Whish Money (Fadi Halal)', 'other', 'income', 900.00, NULL),
  ('2025-02-01', 'Order Alibaba (Fadi Halal)', 'supplier', 'expense', 1027.00, NULL),
  ('2025-02-05', 'Fast Shipping FedEx', 'shipping', 'expense', 445.00, 'Jomrok ($337) + FedEx ($25) + other expenses'),
  ('2025-02-08', 'Water pump + 5 nets', 'supplies', 'expense', 25.00, NULL),
  ('2025-02-10', 'Fadi Halal Refund', 'refund', 'expense', 900.00, NULL),
  ('2025-02-12', 'Shipping', 'shipping', 'expense', 1070.00, NULL),
  ('2025-02-15', 'Carl Ferneino Sale', 'sale', 'income', 1850.00, 'Paid for accessories (Pump, tubes)'),
  ('2025-02-15', 'Carl Ferneino Accessories', 'supplies', 'expense', 35.00, 'Pump, tubes'),
  ('2025-02-18', 'Packaging Cartoons', 'supplies', 'expense', 330.00, '30 Large, 20 small, 50 Chillers'),
  ('2025-02-20', 'Google Ads', 'marketing', 'expense', 141.00, NULL),
  ('2025-02-22', '2 pumps', 'supplies', 'expense', 120.00, 'Plus shipping and jamarek');

-- Verify: total income = 11502, total expenses = 11511, net = -9
-- SELECT
--   SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
--   SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expenses,
--   SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS net_balance
-- FROM transactions;
