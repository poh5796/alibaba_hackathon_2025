// components/FileUpload.tsx
import { Button } from "@/components/ui/button";

export const FileUpload = () => {
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate uploading to OSS
      console.log("Uploading file:", file.name);
      alert(`File "${file.name}" uploaded successfully.`);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-semibold mb-2">Upload Document</h3>
      <input type="file" onChange={handleUpload} className="mb-2" />
      <Button variant="outline">Submit</Button>
    </div>
  );
};