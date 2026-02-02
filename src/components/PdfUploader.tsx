import { useState, useCallback } from "react";
import { Upload, FileText, Download, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "idle" | "uploading" | "processing" | "ready" | "error";

const PdfUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [processedPdfUrl, setProcessedPdfUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setStatus("idle");
      setProcessedPdfUrl(null);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
      setStatus("idle");
      setProcessedPdfUrl(null);
    }
  }, []);

  const handleExtract = async () => {
    if (!file) return;
    
    setStatus("processing");
    
    // Simulate API call - replace with actual backend endpoint
    try {
      const formData = new FormData();
      formData.append("pdf", file);
      
      // TODO: Replace with actual API endpoint
      // const response = await fetch("/api/extract-sort", {
      //   method: "POST",
      //   body: formData,
      // });
      // const blob = await response.blob();
      // setProcessedPdfUrl(URL.createObjectURL(blob));
      
      // Simulated delay for demo
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProcessedPdfUrl(URL.createObjectURL(file)); // Placeholder
      setStatus("ready");
    } catch (error) {
      setStatus("error");
    }
  };

  const handleDownload = () => {
    if (processedPdfUrl) {
      const link = document.createElement("a");
      link.href = processedPdfUrl;
      link.download = "sorted-sku.pdf";
      link.click();
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "processing":
        return "Processing your PDF...";
      case "ready":
        return "Your sorted PDF is ready!";
      case "error":
        return "An error occurred. Please try again.";
      default:
        return file ? `Selected: ${file.name}` : "Upload a Meesho Packing PDF";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "upload-zone relative flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer",
          isDragging && "drag-active",
          file && "has-file"
        )}
      >
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className={cn(
          "upload-icon mb-4 p-4 rounded-full transition-all duration-300",
          file ? "bg-success/10" : "bg-primary/10"
        )}>
          {file ? (
            <FileText className="w-8 h-8 text-success" />
          ) : (
            <Upload className={cn(
              "w-8 h-8 transition-transform duration-300",
              isDragging ? "scale-110 text-primary" : "text-primary/70"
            )} />
          )}
        </div>
        
        <p className="text-foreground font-medium text-center">
          {file ? file.name : "Drag & drop your PDF here"}
        </p>
        <p className="text-muted-foreground text-sm mt-1">
          {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse"}
        </p>
      </div>

      {/* Status Message */}
      <div className={cn(
        "status-card flex items-center gap-3 p-4 rounded-xl transition-all duration-300",
        status === "processing" && "status-processing",
        status === "ready" && "status-ready",
        status === "error" && "status-error"
      )}>
        {status === "processing" && (
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        )}
        {status === "ready" && (
          <CheckCircle2 className="w-5 h-5 text-success" />
        )}
        <span className="text-sm font-medium">{getStatusMessage()}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleExtract}
          disabled={!file || status === "processing"}
          className="w-full h-12 text-base font-medium"
          variant="default"
        >
          {status === "processing" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Extract & Sort SKU"
          )}
        </Button>

        <Button
          onClick={handleDownload}
          disabled={status !== "ready"}
          variant="download"
          className="w-full h-12 text-base font-medium"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Sorted PDF
        </Button>
      </div>
    </div>
  );
};

export default PdfUploader;
