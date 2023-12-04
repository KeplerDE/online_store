import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/user';
import bcrypt from 'bcrypt';

export async function POST(req) {
    const body = await req.json();
    // console.log("body in register api => ", body);
    
    await dbConnect();
    
    try {
        const { name, email, password } = body;
        
        await new User({
            name,
            email,
            password: await bcrypt.hash(password, 10),
        }).save();
        
        return NextResponse.json({ success: 'Registered Successfully' });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ err: err.message }, { status: 500 });
    }
}
