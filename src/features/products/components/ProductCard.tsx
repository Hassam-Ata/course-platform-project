import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/formatters";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export function ProductCard({
  id,
  imageUrl,
  name,
  priceInDollars,
  description,
}: {
  id: string;
  imageUrl: string;
  name: string;
  priceInDollars: number;
  description: string;
}) {
  return (
    <Card className="overflow-hidden flex flex-col w-full max-w-[500px] mx-auto bg-white/10 backdrop-blur-md animated-border border-2 border-transparent rounded-2xl shadow-xl transition-transform hover:scale-[1.015] duration-300">
      <div className="relative aspect-video w-full">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover rounded-t-2xl"
        />
      </div>

      <CardHeader className="space-y-1 px-5 pt-4">
        <CardDescription className="text-blue-200 text-sm font-medium">
          <Suspense fallback={formatPrice(priceInDollars)}>
            <Price price={priceInDollars} />
          </Suspense>
        </CardDescription>
        <CardTitle className="text-white text-2xl tracking-wide">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 text-slate-200 text-sm">
        <p className="line-clamp-3">{description}</p>
      </CardContent>

      <CardFooter className="mt-auto px-5 pb-5">
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-md font-semibold rounded-full py-2 shadow"
          asChild
        >
          <Link href={`/products/${id}`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

async function Price({ price }: { price: number }) {
  return (
    <div className="flex gap-2 items-baseline">
      <div className="line-through text-xs opacity-50">
        {formatPrice(price)}
      </div>
      {/* <div>{formatPrice(price * (1 - coupon.discountPercentage))}</div> */}
    </div>
  );
}
