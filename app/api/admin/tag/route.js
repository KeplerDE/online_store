import { NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Tag from "@/models/tag";
import slugify from "slugify";

export async function POST(req) {
    // Преобразуем запрос в формат JSON
    const _req = await req.json();

    // Подключаемся к базе данных
    await dbConnect();

    try {
        // Извлекаем name и parent из тела запроса
        const { name, parentCategory } = _req;

        // Создаем новый тег с использованием модели Tag
        const tag = await Tag.create({
            name,
            parentCategory,
            slug: slugify(name), // Генерируем slug из имени тега
        });

        // Возвращаем созданный тег в формате JSON
        return NextResponse.json(tag);
    } catch (err) {
        // Логирование ошибки в случае неудачи
        console.log(err);

        // Возвращаем сообщение об ошибке и статус 500
        return NextResponse.json(
            { err: "Server error. Please try again." },
            { status: 500 }
        );
    }
}


export async function GET(req) {
    await dbConnect();

    try {
        const tags = await Tag.find({}).sort({ createdAt: "-1"});

        return NextResponse.json(tags)
    } catch (err) {
        console.log(err);
        return NextResponse.json(
            {
                err: "Server error. Please try again..."
            },
            { status: 500 }
        );
    }
}