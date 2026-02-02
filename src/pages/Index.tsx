import PdfUploader from "@/components/PdfUploader";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Meesho SKU Sorter
          </h1>
          <p className="text-muted-foreground text-sm">
            Upload your packing PDF to extract and sort SKUs
          </p>
        </div>
        <PdfUploader />
      </div>
    </div>
  );
};

export default Index;
