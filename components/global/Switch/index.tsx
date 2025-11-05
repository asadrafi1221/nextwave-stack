import { ShadcnSwitch } from "@/library/imports/components";
import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof ShadcnSwitch>) {
    return <ShadcnSwitch className={cn("", className)} {...props} />;
}

export default Switch;