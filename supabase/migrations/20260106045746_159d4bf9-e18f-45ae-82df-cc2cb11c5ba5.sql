-- Insert admin role for bob12@gmail.com (bypasses RLS since migrations run with elevated privileges)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('382455ab-257a-430a-9424-d33f152323d3', 'admin'::app_role)
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert sample bills data for admin section
INSERT INTO public.bills (user_id, bill_month, total_units, total_amount, due_date, paid, paid_at)
VALUES 
  ('382455ab-257a-430a-9424-d33f152323d3', 'December 2024', 350, 5250, '2025-01-15', true, '2025-01-10'),
  ('382455ab-257a-430a-9424-d33f152323d3', 'November 2024', 420, 6300, '2024-12-15', true, '2024-12-12'),
  ('382455ab-257a-430a-9424-d33f152323d3', 'October 2024', 380, 5700, '2024-11-15', true, '2024-11-08'),
  ('de11d3db-b00f-4913-af8c-be2c3b22469f', 'December 2024', 280, 4200, '2025-01-15', false, NULL),
  ('de11d3db-b00f-4913-af8c-be2c3b22469f', 'November 2024', 310, 4650, '2024-12-15', true, '2024-12-10'),
  ('de11d3db-b00f-4913-af8c-be2c3b22469f', 'October 2024', 295, 4425, '2024-11-15', true, '2024-11-14'),
  ('5d26da51-cd08-4c68-ae49-04cf74f19fa0', 'December 2024', 520, 7800, '2025-01-15', false, NULL),
  ('5d26da51-cd08-4c68-ae49-04cf74f19fa0', 'November 2024', 480, 7200, '2024-12-15', true, '2024-12-09'),
  ('5d26da51-cd08-4c68-ae49-04cf74f19fa0', 'October 2024', 510, 7650, '2024-11-15', true, '2024-11-11');

-- Insert sample usage records
INSERT INTO public.usage_records (user_id, recorded_date, units_consumed, cost)
VALUES 
  ('382455ab-257a-430a-9424-d33f152323d3', '2024-12-01', 12, 180),
  ('382455ab-257a-430a-9424-d33f152323d3', '2024-12-02', 15, 225),
  ('382455ab-257a-430a-9424-d33f152323d3', '2024-12-03', 11, 165),
  ('de11d3db-b00f-4913-af8c-be2c3b22469f', '2024-12-01', 9, 135),
  ('de11d3db-b00f-4913-af8c-be2c3b22469f', '2024-12-02', 10, 150),
  ('5d26da51-cd08-4c68-ae49-04cf74f19fa0', '2024-12-01', 18, 270),
  ('5d26da51-cd08-4c68-ae49-04cf74f19fa0', '2024-12-02', 16, 240);