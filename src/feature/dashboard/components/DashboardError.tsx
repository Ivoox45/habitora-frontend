import { AlertCircle } from "lucide-react";

interface Props {
    message: string;
}

export function DashboardError({ message }: Props) {
    return (
        <div className="p-6">
            <div className="flex items-center gap-3 text-red-600 bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-900">
                <AlertCircle className="w-5 h-5" />
                <p>{message}</p>
            </div>
        </div>
    );
}
