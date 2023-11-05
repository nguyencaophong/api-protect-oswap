import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Role {
    @Prop({ types: mongoose.Schema.Types.String })
    name: string

    @Prop({ type: [mongoose.Schema.Types.String] })
    permissions: string[]
}
