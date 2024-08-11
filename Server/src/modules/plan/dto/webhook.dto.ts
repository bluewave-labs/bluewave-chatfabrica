import {
  IsNumber,
  IsString,
  IsBoolean,
  IsDate,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class SubscriptionDto {
  data: WebhookDto;
  meta: {
    event_name: string;
    custom_data: {
      type: string;
      quantity?: number;
      price?: number;
      planName?: string;
      plan_id?: string;
      user_id?: string;
    };
  };
}

export class WebhookDto {
  @IsString()
  type: string;

  @IsString()
  id: string;

  attributes: WebhookAttributesDto;
}

export class WebhookAttributesDto {
  @IsNumber()
  store_id: number;

  @IsNumber()
  customer_id: number;

  @IsString()
  order_id: string;

  @IsNumber()
  order_item_id: number;

  @IsNumber()
  product_id: number;

  @IsNumber()
  variant_id: number;

  @IsString()
  product_name: string;

  @IsString()
  variant_name: string;

  @IsString()
  user_name: string;

  @IsEmail()
  user_email: string;

  @IsString()
  status: string;

  @IsString()
  status_formatted: string;

  @IsString()
  card_brand: string;

  @IsString()
  card_last_four: string;

  pause: any;

  @IsBoolean()
  cancelled: boolean;

  pause_ends_at: Date;

  @IsOptional()
  @IsDate()
  trial_ends_at: Date;

  @IsNumber()
  billing_anchor: number;

  first_subscription_item: {
    id: number;
    subscription_id: number;
    price_id: number;
    quantity: number;
    created_at: Date;
    updated_at: Date;
  };

  urls: {
    update_payment_method: string;
    customer_portal: string;
    customer_portal_update_subscription: string;
  };

  @IsDate()
  renews_at: Date;

  ends_at: Date;

  @IsDate()
  created_at: Date;

  @IsDate()
  updated_at: Date;

  @IsBoolean()
  test_mode: boolean;
}
