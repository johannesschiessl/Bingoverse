"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { generateBase26Slug, addDays, formatDateForInput } from "@/lib/utils";
import { createGame } from "@/actions/game/new";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  CopyIcon,
  CheckIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { gameIconOptions } from "@/constants/shared/icons";
import { colorOptions } from "@/constants/shared/colors";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  slug: z.string().min(9, {
    message: "Slug must be at least 9 characters.",
  }),
  color: z.string({
    required_error: "Please select a color.",
  }),
  icon: z.string({
    required_error: "Please select an icon.",
  }),
  password: z.string().optional(),
  expires_at: z.string({
    required_error: "Please select an expiration date.",
  }),
  counter_on: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

function BasicInfoStep({
  form,
  onContinue,
}: {
  form: UseFormReturn<FormValues>;
  onContinue: () => void;
}) {
  const currentColor = form.watch("color") || "orange";
  const currentIcon = form.watch("icon") || "GAMEPAD";

  const selectedColor =
    colorOptions.find((c) => c.value === currentColor) ||
    colorOptions.find((c) => c.value === "orange")!;
  const selectedIcon =
    gameIconOptions.find((i) => i.value === currentIcon) ||
    gameIconOptions.find((i) => i.value === "GAMEPAD")!;

  const SelectedIcon = selectedIcon.icon;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Game Basics</CardTitle>
          <CardDescription>
            Choose a name, color, and icon for your game
          </CardDescription>
        </CardHeader>

        <div className="px-6 pb-2">
          <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg mb-6">
            <div
              className={cn(
                "size-12 rounded-lg flex items-center justify-center",
                selectedColor.bg,
              )}
            >
              <SelectedIcon className={cn("size-6", selectedColor.text)} />
            </div>
            <div>
              <h3 className="font-medium text-lg">
                {form.watch("name") || "Game Name"}
              </h3>
            </div>
          </div>
        </div>

        <CardContent className="space-y-6">
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Game Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Game" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a color" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "size-4 rounded-full",
                                  color.bg,
                                  color.text,
                                )}
                              />
                              <span>{color.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gameIconOptions.map((icon) => {
                          const IconComponent = icon.icon;
                          return (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="size-4" />
                                <span>{icon.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onContinue} type="button">
            Continue <ChevronRightIcon />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function SecurityStep({
  form,
  onBack,
  onContinue,
}: {
  form: UseFormReturn<FormValues>;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>
            Set password and expiration for your game
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Leave blank for no password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Set a password to restrict access to the game
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expires_at"
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel>Expires At</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>
                    When the game will expire and be removed
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onBack} type="button" variant="outline">
            <ChevronLeftIcon /> Back
          </Button>
          <Button onClick={onContinue} type="button">
            Continue <ChevronRightIcon />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function FeaturesStep({
  form,
  onBack,
  onContinue,
}: {
  form: UseFormReturn<FormValues>;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Game Features</CardTitle>
          <CardDescription>
            Configure additional features for your game
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <FormField
              control={form.control}
              name="counter_on"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Counter</FormLabel>
                    <FormDescription>
                      Enable a counter for the game
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onBack} type="button" variant="outline">
            <ChevronLeftIcon /> Back
          </Button>
          <Button onClick={onContinue} type="button">
            Review <ChevronRightIcon />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function ReviewStep({
  form,
  onBack,
  onSubmit,
  isSubmitting,
}: {
  form: UseFormReturn<FormValues>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) {
  const currentColor = form.watch("color") || "orange";
  const currentIcon = form.watch("icon") || "GAMEPAD";
  const formValues = form.getValues();

  const selectedColor =
    colorOptions.find((c) => c.value === currentColor) ||
    colorOptions.find((c) => c.value === "orange")!;
  const selectedIcon =
    gameIconOptions.find((i) => i.value === currentIcon) ||
    gameIconOptions.find((i) => i.value === "GAMEPAD")!;

  const SelectedIcon = selectedIcon.icon;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Review Game</CardTitle>
          <CardDescription>
            Review your game details before creating
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <div className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg mb-6">
              <div
                className={cn(
                  "size-12	 rounded-lg flex items-center justify-center",
                  selectedColor.bg,
                )}
              >
                <SelectedIcon className={cn("size-6", selectedColor.text)} />
              </div>
              <div>
                <h3 className="font-medium text-lg">
                  {formValues.name || "Game Name"}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500">
                    Game Name
                  </h4>
                  <p>{formValues.name}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Slug</h4>
                  <p>{formValues.slug}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Color</h4>
                  <p className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-block size-3 rounded-full",
                        selectedColor.bg,
                      )}
                    ></span>
                    {selectedColor.label}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Icon</h4>
                  <p className="flex items-center gap-2">
                    <SelectedIcon className="size-4" />
                    {selectedIcon.label}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">
                    Password
                  </h4>
                  <p>{formValues.password ? "Set" : "None"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">
                    Expires At
                  </h4>
                  <p>{new Date(formValues.expires_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Counter</h4>
                  <p>{formValues.counter_on ? "Enabled" : "Disabled"}</p>
                </div>
              </div>
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={onBack} type="button" variant="outline">
            <ChevronLeftIcon /> Back
          </Button>
          <Button onClick={onSubmit} type="button" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Game"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function SuccessStep({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);
  const gameUrl = `${window.location.origin}/${slug}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={cardVariants}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Game Created!</CardTitle>
          <CardDescription>
            Your new game has been created successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-2">Game URL</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-2 bg-white dark:bg-neutral-900 border rounded text-sm overflow-x-auto">
                {gameUrl}
              </code>
              <Button size="sm" variant="outline" onClick={copyToClipboard}>
                {copied ? (
                  <CheckIcon className="size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link href={`/${slug}`}>
            <Button>Play Game</Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export default function NewPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const thirtyDaysFromNow = formatDateForInput(addDays(new Date(), 30));

  const generatedSlug = generateBase26Slug(9);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: generatedSlug,
      color: "orange",
      icon: "GAMEPAD",
      password: "",
      expires_at: thirtyDaysFromNow,
      counter_on: false,
    },
  });

  async function onSubmit() {
    try {
      setIsSubmitting(true);

      const values = form.getValues();

      const gameData = {
        slug: values.slug,
        name: values.name,
        color: values.color,
        icon: values.icon,
        password: values.password || undefined,
        expires_at: values.expires_at,
        counter_on: values.counter_on,
      };

      await createGame(gameData);

      setCurrentStep(5);
    } catch (error) {
      console.error("Error creating game:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const goToNext = () => {
    if (currentStep === 1) {
      form.trigger(["name", "color", "icon"]).then((isValid) => {
        if (isValid) setCurrentStep((prev) => prev + 1);
      });
    } else if (currentStep === 2) {
      form.trigger(["password", "expires_at"]).then((isValid) => {
        if (isValid) setCurrentStep((prev) => prev + 1);
      });
    } else if (currentStep === 3) {
      form.trigger(["counter_on"]).then((isValid) => {
        if (isValid) setCurrentStep((prev) => prev + 1);
      });
    }
  };

  const goToPrevious = () => {
    setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <BasicInfoStep key="step1" form={form} onContinue={goToNext} />
        )}
        {currentStep === 2 && (
          <SecurityStep
            key="step2"
            form={form}
            onBack={goToPrevious}
            onContinue={goToNext}
          />
        )}
        {currentStep === 3 && (
          <FeaturesStep
            key="step3"
            form={form}
            onBack={goToPrevious}
            onContinue={goToNext}
          />
        )}
        {currentStep === 4 && (
          <ReviewStep
            key="step4"
            form={form}
            onBack={goToPrevious}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        {currentStep === 5 && (
          <SuccessStep key="step5" slug={form.getValues().slug} />
        )}
      </AnimatePresence>
    </div>
  );
}
