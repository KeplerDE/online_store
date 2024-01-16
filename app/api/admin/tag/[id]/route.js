import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Tag from "@/models/tag";
import slugify from "slugify";

export async function PUT(req, context) {
    
    await dbConnect();

    
    const body = await req.json();
    

    try {
        
        const updatingTag = await Tag.findByIdAndUpdate(
            context.params.id,{
            ...body,
            slug: slugify(body.name),
        },
        { new: true }
        );

       
        return NextResponse.json(updatingTag);
    } catch (err) {
        
        console.log(err);

        
        return NextResponse.json(
            { err: err.message },
            { status: 500 }
        );
    }
}


export async function DELETE(req, context) {
    // Подключение к базе данных
    await dbConnect();

    try {
        // Удаляем тег по ID, полученному из параметров запроса
        const deletedTag = await Tag.findByIdAndDelete(context.params.id);

        // Возвращаем удаленный тег в ответе
        return NextResponse.json(deletedTag);
    } catch (err) {
        // Логирование ошибки
        console.log(err);

        // Возвращаем JSON-ответ с сообщением об ошибке и статусом 500
        return NextResponse.json(
            { err: err.message },
            { status: 500 }
        );
    }
}