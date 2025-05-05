// src/modules/documents/components/DocumentViewer.tsx

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Document as PDFDocument, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configurar el worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentViewerProps {
    url: string;
    mimeType: string;
}

export function DocumentViewer({ url, mimeType }: DocumentViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [isPdfLoading, setIsPdfLoading] = useState(true);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsPdfLoading(false);
    };

    const nextPage = () => {
        if (pageNumber < (numPages || 1)) {
            setPageNumber(pageNumber + 1);
        }
    };

    const prevPage = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const zoomIn = () => {
        setScale(scale + 0.2);
    };

    const zoomOut = () => {
        if (scale > 0.6) {
            setScale(scale - 0.2);
        }
    };

    const rotate = () => {
        setRotation((rotation + 90) % 360);
    };

    const isPdf = mimeType.includes('pdf');
    const isImage = mimeType.includes('image');

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-4">
                <div className="flex justify-center mb-4 gap-2">
                    {isPdf && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={prevPage}
                                disabled={pageNumber <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="flex items-center mx-2">
                                Página {pageNumber} de {numPages || '--'}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={nextPage}
                                disabled={pageNumber >= (numPages || 1)}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                    <Button variant="outline" size="sm" onClick={zoomIn}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={zoomOut}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={rotate}>
                        <RotateCw className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex justify-center overflow-auto">
                    {isPdf ? (
                        <div className="max-h-[600px] overflow-auto">
                            {isPdfLoading && (
                                <div className="flex justify-center items-center min-h-[300px]">
                                    <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                </div>
                            )}
                            <PDFDocument
                                file={url}
                                onLoadSuccess={onDocumentLoadSuccess}
                                onLoadError={(error: any) => console.error('Error loading PDF:', error)}
                                loading={
                                    <div className="flex justify-center items-center min-h-[300px]">
                                        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                                    </div>
                                }
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    rotate={rotation}
                                />
                            </PDFDocument>
                        </div>
                    ) : isImage ? (
                        <div
                            style={{
                                transform: `scale(${scale}) rotate(${rotation}deg)`,
                                maxHeight: '600px',
                                transition: 'transform 0.3s ease'
                            }}
                            className="flex justify-center"
                        >
                            <img
                                src={url}
                                alt="Documento"
                                className="max-w-full h-auto object-contain"
                                style={{ maxHeight: '600px' }}
                            />
                        </div>
                    ) : (
                        <div className="p-8 text-center text-muted-foreground">
                            <p>Este tipo de archivo no puede ser visualizado directamente.</p>
                            <Button className="mt-4" onClick={() => window.open(url, '_blank')}>
                                Descargar Archivo
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}