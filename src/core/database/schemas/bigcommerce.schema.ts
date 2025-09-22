import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BigCommerceDocument = BigCommerce & Document;

export enum Category {
    B2B = 'b2b',
    B2C = 'b2c'
}

export enum Status {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

@Schema({ timestamps: true })
export class BigCommerce {
    @Prop({ required: true })
    producer: string;
  
    @Prop({ required: true })
    hash: string;
    
    @Prop({ required: true })
    store_id: string;
  
    @Prop({ required: true })
    scope: string;
  
    @Prop({ required: true, type: Object })
    data: any;
    
    @Prop({ required: true, enum: Category })
    category: Category;

    @Prop({ required: true, enum: Status })
    status: Status;
}

export const BigCommerceSchema = SchemaFactory.createForClass(BigCommerce);
