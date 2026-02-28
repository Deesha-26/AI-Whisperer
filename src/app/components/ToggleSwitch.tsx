import * as SwitchPrimitive from '@radix-ui/react-switch';

interface ToggleSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({ checked, onCheckedChange, disabled }: ToggleSwitchProps) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className="w-11 h-6 bg-[#E6E8EC] rounded-full relative data-[state=checked]:bg-[#4C7DFF] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <SwitchPrimitive.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transition-transform translate-x-0.5 data-[state=checked]:translate-x-[22px]" />
    </SwitchPrimitive.Root>
  );
}
