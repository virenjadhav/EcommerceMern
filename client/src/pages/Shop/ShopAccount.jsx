import accImg from "../../assets/account.jpg";
import ShopAddress from "@/components/shop/ShopAddress";
import ShopOrder from "@/components/shop/ShopOrder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function ShopAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShopOrder />
            </TabsContent>
            <TabsContent value="address">
              <ShopAddress />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShopAccount;
