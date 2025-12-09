import { NextRequest, NextResponse } from 'next/server'

/**
 * API Route для проксирования изображений из Supabase Storage
 * Решает проблему Mixed Content (HTTP на HTTPS странице)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params
    const path = pathArray.join('/')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!supabaseUrl) {
      return NextResponse.json(
        { error: 'Supabase URL not configured' },
        { status: 500 }
      )
    }

    // Формируем URL к файлу в Supabase Storage
    const storageUrl = `${supabaseUrl}/storage/v1/object/public/${path}`

    // Загружаем файл из Supabase
    const response = await fetch(storageUrl)

    if (!response.ok) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    // Получаем данные файла
    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    // Возвращаем файл с правильными заголовками
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error proxying storage file:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}