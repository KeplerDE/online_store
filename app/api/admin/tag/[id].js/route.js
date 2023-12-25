import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Tag from "@/models/tag";
import slugify from "slugify";

export async function PUT(req, context) {
    // Подключаемся к базе данных
    await dbConnect();

    // Преобразуем запрос в формат JSON
    const body = await req.json();
    

    try {
        console.log("request", body)
        // Обновляем тег, используя ID из параметров запроса и данные из тела запроса
        const updatingTag = await Tag.findByIdAndUpdate(
            context.params.id,{
            ...body,
            slug: slugify(body.name),
        },
        { new: true }
        );

        // Возвращаем обновленный тег в формате     JSON
        return NextResponse.json(updatingTag);
    } catch (err) {
        // Логирование ошибки в консоль
        console.log(err);

        // Возвращаем сообщение об ошибке и статус 500
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