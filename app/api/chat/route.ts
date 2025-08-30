import { NextRequest, NextResponse } from 'next/server';
import { generateText, streamText } from 'ai';
import { getGenerativeModel } from '@/lib/ai/models';
import { SYSTEM_PROMPT } from '@/prompts/system';
import { prisma } from '@/lib/prisma';
import { extractDataFromFileBuffer, getFirstFiveRowsAsString, parseAndLogJSON } from '@/lib/utils/file-utils';
import { markDownToJson } from '@/lib/utils/json-parser';
import { executeSteps, processDataToChartFormat } from '@/server/services/generationStep';

export async function POST(req: NextRequest) {
  try {
    const { prompt, conversationId } = await req.json();
    console.log("🚀 ~ POST ~ prompt:", prompt)

    // if (!prompt || !conversationId) {
    //   return NextResponse.json(
    //     { error: 'Prompt and Conversation ID are required' },
    //     { status: 400 },
    //   );
    // }

    // // 1. Get the conversation and associated file
    // const conversation = await prisma.conversation.findUnique({
    //   where: { id: conversationId },
    //   include: { file: true },
    // });

    // if (!conversation || !conversation.file) {
    //   return NextResponse.json(
    //     { error: 'Conversation or file not found' },
    //     { status: 404 },
    //   );
    // }

    const url = "https://dskougfzdmpkvchhexbi.supabase.co/storage/v1/object/sign/chartix/uploads/cmet06bxn0004g0ao44ls8zya/1756582545384-testing.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81OTY0NjgyNS0xYTgwLTQyZjYtODViMy0yNDRiNjM3MDQ3ZjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjaGFydGl4L3VwbG9hZHMvY21ldDA2YnhuMDAwNGcwYW80NGxzOHp5YS8xNzU2NTgyNTQ1Mzg0LXRlc3RpbmcuY3N2IiwiaWF0IjoxNzU2NTgyNTkzLCJleHAiOjE3NTcxODczOTN9.aSHmDnour_z55T8bhTKTpSCNSIRfO3mbv-obt7mXEY0"

    // 2. Fetch the file content
    const response = await fetch(url || "https://www.designtrack.co/api/xls/reports/master-reports/62ece3a36359f714ab281575?sortBy=%5B%7B%22field%22%3A%22customerName%22%2C%22sort%22%3A%22asc%22%7D%5D&columns=%5B%7B%22label%22%3A%22Customer+Name%22%2C%22value%22%3A%22customerName%22%7D%2C%7B%22label%22%3A%22Sales+Order+Number%22%2C%22value%22%3A%22salesOrderNumber%22%7D%2C%7B%22label%22%3A%22Order+Date%22%2C%22value%22%3A%22orderDate%22%7D%2C%7B%22label%22%3A%22Customer+PO%22%2C%22value%22%3A%22customerPo%22%7D%2C%7B%22label%22%3A%22Customer+Phone%22%2C%22value%22%3A%22customerPhone%22%7D%2C%7B%22label%22%3A%22Customer+Number%22%2C%22value%22%3A%22customerNumber%22%7D%2C%7B%22label%22%3A%22Customer+Email%22%2C%22value%22%3A%22customerEmail%22%7D%2C%7B%22label%22%3A%22Customer+Address%22%2C%22value%22%3A%22customerFullAddress%22%7D%2C%7B%22label%22%3A%22Customer+Reseller+No%22%2C%22value%22%3A%22customerResellerNumber%22%7D%2C%7B%22label%22%3A%22Sales+Region%22%2C%22value%22%3A%22salesRegion%22%7D%2C%7B%22label%22%3A%22Sales+Region+Description%22%2C%22value%22%3A%22salesRegionDescription%22%7D%2C%7B%22label%22%3A%22Manufacturer+Name%22%2C%22value%22%3A%22manufacturerName%22%7D%2C%7B%22label%22%3A%22Sub+Total%22%2C%22value%22%3A%22subTotal%22%7D%2C%7B%22label%22%3A%22Discount%22%2C%22value%22%3A%22discountAmount%22%7D%2C%7B%22label%22%3A%22Refund%22%2C%22value%22%3A%22refund%22%7D%2C%7B%22label%22%3A%22Net+Sales+Total%22%2C%22value%22%3A%22netSalesTotal%22%7D%2C%7B%22label%22%3A%22Shipping+Charges%22%2C%22value%22%3A%22freight%22%7D%2C%7B%22label%22%3A%22Sales+Tax%22%2C%22value%22%3A%22salesTax%22%7D%2C%7B%22label%22%3A%22Misc+Charges%22%2C%22value%22%3A%22miscCharges%22%7D%2C%7B%22label%22%3A%22SO+Total%22%2C%22value%22%3A%22total%22%7D%2C%7B%22label%22%3A%22Invoice+Total%22%2C%22value%22%3A%22invoiceTotal%22%7D%2C%7B%22label%22%3A%22Paid+Amount%22%2C%22value%22%3A%22lessPayment%22%7D%2C%7B%22label%22%3A%22Due+Balance%22%2C%22value%22%3A%22dueBalance%22%7D%2C%7B%22label%22%3A%22Order+Status%22%2C%22value%22%3A%22status%22%7D%2C%7B%22label%22%3A%22Payment+Status%22%2C%22value%22%3A%22paymentStatus%22%7D%2C%7B%22label%22%3A%22Commission+Status%22%2C%22value%22%3A%22commissionStatus%22%7D%2C%7B%22label%22%3A%22Shipping+Status%22%2C%22value%22%3A%22shippingStatus%22%7D%2C%7B%22label%22%3A%22Payment+Term+Name%22%2C%22value%22%3A%22paymentTermsName%22%7D%2C%7B%22label%22%3A%22Sales+Person%22%2C%22value%22%3A%22salesPersonName%22%7D%2C%7B%22label%22%3A%22Sales+Person+Email%22%2C%22value%22%3A%22salesPersonEmail%22%7D%2C%7B%22label%22%3A%22Eligible+Commission%22%2C%22value%22%3A%22commission%22%7D%2C%7B%22label%22%3A%22Sales+Person+Commission%22%2C%22value%22%3A%22salesPersonCommission%22%7D%2C%7B%22label%22%3A%22Due%2FShip+Date%22%2C%22value%22%3A%22dueDate%22%7D%2C%7B%22label%22%3A%22QB+Invoice+Date%22%2C%22value%22%3A%22customerInvoiceDate%22%7D%2C%7B%22label%22%3A%22Estimated+Ship+Date%22%2C%22value%22%3A%22estimatedShipDate%22%7D%2C%7B%22label%22%3A%22Customer+Address+City%22%2C%22value%22%3A%22billTo.city%22%7D%2C%7B%22label%22%3A%22Customer+Address+State%22%2C%22value%22%3A%22billTo.state%22%7D%2C%7B%22label%22%3A%22Customer+Address+Zipcode%22%2C%22value%22%3A%22billTo.zipCode%22%7D%5D&city=&module=sales&state=&timezone=Asia%2FCalcutta&locationFilter=%5B%5D&chartPeriod=lastWeek&salesRegion=&reportingColumns=%5B%7B%22label%22%3A%22Customer+Name%22%2C%22value%22%3A%22customerName%22%7D%2C%7B%22label%22%3A%22Sales+Order+Number%22%2C%22value%22%3A%22salesOrderNumber%22%7D%2C%7B%22label%22%3A%22Order+Date%22%2C%22value%22%3A%22orderDate%22%7D%2C%7B%22label%22%3A%22Customer+PO%22%2C%22value%22%3A%22customerPo%22%7D%2C%7B%22label%22%3A%22Customer+Phone%22%2C%22value%22%3A%22customerPhone%22%7D%2C%7B%22label%22%3A%22Customer+Number%22%2C%22value%22%3A%22customerNumber%22%7D%2C%7B%22label%22%3A%22Customer+Email%22%2C%22value%22%3A%22customerEmail%22%7D%2C%7B%22label%22%3A%22Customer+Address%22%2C%22value%22%3A%22customerFullAddress%22%7D%2C%7B%22label%22%3A%22Customer+Reseller+No%22%2C%22value%22%3A%22customerResellerNumber%22%7D%2C%7B%22label%22%3A%22Sales+Region%22%2C%22value%22%3A%22salesRegion%22%7D%2C%7B%22label%22%3A%22Sales+Region+Description%22%2C%22value%22%3A%22salesRegionDescription%22%7D%2C%7B%22label%22%3A%22Manufacturer+Name%22%2C%22value%22%3A%22manufacturerName%22%7D%2C%7B%22label%22%3A%22Sub+Total%22%2C%22value%22%3A%22subTotal%22%7D%2C%7B%22label%22%3A%22Discount%22%2C%22value%22%3A%22discountAmount%22%7D%2C%7B%22label%22%3A%22Refund%22%2C%22value%22%3A%22refund%22%7D%2C%7B%22label%22%3A%22Net+Sales+Total%22%2C%22value%22%3A%22netSalesTotal%22%7D%2C%7B%22label%22%3A%22Shipping+Charges%22%2C%22value%22%3A%22freight%22%7D%2C%7B%22label%22%3A%22Sales+Tax%22%2C%22value%22%3A%22salesTax%22%7D%2C%7B%22label%22%3A%22Misc+Charges%22%2C%22value%22%3A%22miscCharges%22%7D%2C%7B%22label%22%3A%22SO+Total%22%2C%22value%22%3A%22total%22%7D%2C%7B%22label%22%3A%22Invoice+Total%22%2C%22value%22%3A%22invoiceTotal%22%7D%2C%7B%22label%22%3A%22Paid+Amount%22%2C%22value%22%3A%22lessPayment%22%7D%2C%7B%22label%22%3A%22Due+Balance%22%2C%22value%22%3A%22dueBalance%22%7D%2C%7B%22label%22%3A%22Order+Status%22%2C%22value%22%3A%22status%22%7D%2C%7B%22label%22%3A%22Payment+Status%22%2C%22value%22%3A%22paymentStatus%22%7D%2C%7B%22label%22%3A%22Commission+Status%22%2C%22value%22%3A%22commissionStatus%22%7D%2C%7B%22label%22%3A%22Shipping+Status%22%2C%22value%22%3A%22shippingStatus%22%7D%2C%7B%22label%22%3A%22Payment+Term+Name%22%2C%22value%22%3A%22paymentTermsName%22%7D%2C%7B%22label%22%3A%22Sales+Person%22%2C%22value%22%3A%22salesPersonName%22%7D%2C%7B%22label%22%3A%22Sales+Person+Email%22%2C%22value%22%3A%22salesPersonEmail%22%7D%2C%7B%22label%22%3A%22Eligible+Commission%22%2C%22value%22%3A%22commission%22%7D%2C%7B%22label%22%3A%22Sales+Person+Commission%22%2C%22value%22%3A%22salesPersonCommission%22%7D%2C%7B%22label%22%3A%22Due%2FShip+Date%22%2C%22value%22%3A%22dueDate%22%7D%2C%7B%22label%22%3A%22Estimated+Ship+Date%22%2C%22value%22%3A%22estimatedShipDate%22%7D%2C%7B%22label%22%3A%22Customer+Address+City%22%2C%22value%22%3A%22billTo.city%22%7D%2C%7B%22label%22%3A%22Customer+Address+State%22%2C%22value%22%3A%22billTo.state%22%7D%2C%7B%22label%22%3A%22Customer+Address+Zipcode%22%2C%22value%22%3A%22billTo.zipCode%22%7D%5D&role=62b0574d888c730a11ae0164&roleName=GOD&companyName=Ernest+Gaspard+%26+Associates&template=Sales+Report&printContactInformation=true");
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch file data' },
        { status: 500 },
      );
    }
    const fileBuffer = await response.arrayBuffer();

    // 3. Extract and process data from the file
    let data = extractDataFromFileBuffer(fileBuffer);
    const fiveRowsData = getFirstFiveRowsAsString(data);

    // 5. Construct the final prompt
    const finalPrompt = `
      Table Data:
      ${fiveRowsData}

      User Query:
      ${prompt}
    `;

    const model = getGenerativeModel();

    // 6. Send the response with stream
    const result =  await generateText({
      model: model,
      system: SYSTEM_PROMPT,
      prompt: finalPrompt,
    });
    console.log("🚀 ~ POST ~ result:", result.text)

      // --- Parse JSON from AI ---
      const parsedJson = 
      // [
      //   {
      //     type: 'derive',
      //     name: 'Customer_SalesPerson',
      //     expression: "d => `${d['Customer Name']} - ${d['Sales Person']}`"
      //   },
      //   {
      //     type: 'groupBy',
      //     groupByColumns: [ 'Customer_SalesPerson' ],
      //     numericalColumnsToAggregate: { 'Net Sales Total': 'sum' }
      //   }
      // ]
      
      markDownToJson(result.text);
      console.log("🚀 ~ POST ~ parsedJson:", parsedJson)

      const formattedData: Record<string, any[]> = {}

      // data = data.slice(2)
      
      data[0].forEach((column,index)=>{
        formattedData[column] = data?.slice(1)?.map((row)=>row?.[index])
      })


      const transformedData = processDataToChartFormat(formattedData, parsedJson?.steps ? parsedJson?.steps : parsedJson, parsedJson?.columns ? parsedJson?.columns : []);
      // console.log("🚀 ~ POST ~ transformedData:", transformedData)

    // Parse and log the result as JSON
    // const parsedResult = parseAndLogJSON(await result);
    return NextResponse.json({ result: transformedData });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred' },
      { status: 500 },
    );
  }
}
