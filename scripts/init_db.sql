create extension if not exists "uuid-ossp";

-- Product model
CREATE TABLE IF NOT EXISTS products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    description TEXT,
    price INTEGER
);

-- Stock model:
-- foreign key from products.id
-- There are no more products than this count in stock
CREATE TABLE IF NOT EXISTS stocks (
    product_id UUID REFERENCES products,
    count INTEGER
);
