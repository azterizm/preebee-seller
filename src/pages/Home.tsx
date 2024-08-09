
import Accordian from '../components/Accordian'
import Button from '../components/Button'
import Step from '../components/home/Step'
import { BaseHtml } from '../components/root'

export interface HomeProps {}

export default function Home(_: HomeProps) {
  return (
    <BaseHtml>
      <body>
        <div class='flex items-center justify-between'>
          <img src='/logo_full.png' alt='Logo' class='w-24' />
          <div class='flex items-center gap-4'>
            <Button href='/login' class='bg-secondary'>
              open your account
            </Button>
          </div>
        </div>
        <div
          style='height:80vh;'
          class='flex items-center justify-center flex-col'
        >
          <h1 style='font-size:128px;' class='font-bold'>
            Sell Karo
          </h1>
          <Button href='/login'>Get started</Button>
        </div>
        <div class='grid grid-cols-2 gap-4'>
          <h1 style='font-size:64px;'>
            <span class='font-medium'>All problems are</span>{' '}
            <span class='font-bold'>khatam</span>!
          </h1>
          <div class='flex items-center gap-2 flex-col'>
            <h1 style='font-size:64px;' class='font-bold'>
              WE
            </h1>
            <div class='ml-4'>
              <p>sell together.</p>
              <p>become a community.</p>
              <p>help each other.</p>
            </div>
          </div>
        </div>
        <div class='my-32'>
          <h1 style='font-size:64px;' class='font-medium'>
            Modern way of selling is now in{' '}
            <span class='font-bold'>Pakistan</span>. Helping everyone to sell
            from home.
          </h1>
        </div>
        <div class='my-8'>
          <div class='mb-4'>
            <h1 style='font-size:64px;' class='text-center font-medium'>
              How?
            </h1>
            <div class='grid grid-cols-3 gap-4'>
              <Step
                step={1}
                content='Upload your product details with your desired price.'
              />
              <Step step={2} content='Customer buys your product.' />
              <Step step={3} content='Rider picks up your product.' />
              <Step
                step={4}
                content='Rider delivers your product to the customer address.'
              />
              <Step
                step={5}
                content='Total amount recieved from customer is transferred to your Preebee account.'
              />
              <Step
                step={6}
                content='When you have enough amount available in your Preebee account, you can withdraw through one of many options available.'
              />
            </div>
          </div>
        </div>
        <div class='my-32'>
          <div class='grid grid-cols-3'>
            <h1 style='font-size:64px;' class='font-medium'>
              Kamai mahfooz!
            </h1>
            <div class='bg-tint p-4 rounded-lg col-span-2 flex items-center justify-center'>
              <ul class='space-y-2 list-inside'>
                <li class='flex items-start'>
                  <img
                    class='w-icon mr-2'
                    src='/icons/star-fill.svg'
                    alt='Star'
                  />
                  <span>
                    All earnings are in one place. Your very personal{' '}
                    <b>Preebee</b> account.
                  </span>
                </li>
                <li class='flex items-start'>
                  <img
                    class='w-icon mr-2'
                    src='/icons/star-fill.svg'
                    alt='Star'
                  />
                  <p>
                    Withdraw anytime you want with options including (but not
                    limited to){' '}
                    <span class='text-red-600 text-medium'>JazzCash</span>,{' '}
                    <span class='text-green-600 text-medium'>EasyPaisa</span>,{' '}
                    <span class='text-purple-600 text-medium'>
                      IBFT Bank Transfer
                    </span>
                    , etc.
                  </p>
                </li>
                <li class='flex items-start'>
                  <img
                    class='w-icon mr-2'
                    src='/icons/star-fill.svg'
                    alt='Star'
                  />
                  <p>All amounts are managed automatically for you.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class='my-32 flex items-center justify-center flex-col'>
          <h1 class='font-bold mb-4' style='font-size:64px;'>
            Let's start today!
          </h1>
          <Button href='/login'>Get started</Button>
        </div>
        <div class='w-full bg-primary' style='height:2px;' />
        <div class='my-8 w-full'>
          <h1 class='text-2xl mb-8 font-bold'>Questions</h1>
          <div class='grid lg:grid-cols-2 gap-2'>
            <Accordian
              title='What if the customer does not want to pay?'
              content={`When the rider visits the customer address and customer refuses to pay or declines the order then your product is safely returned to your (seller) address. You do not have to keep track of this process or worry about the customer response as we will handle it ourselves. Please note that the shipping costs from Preebee services will be deducted from your account.`}
            />
            <Accordian
              title='What type of products can I sell?'
              content={`You can sell hair, skin, and makeup products on Preebee. If you want to sell more type of products then please be patient as other versions of Preebee will release soon, enabling you to sell more types of products.`}
            />
            <Accordian
              title='How much money can I make from Preebee?'
              content={`It depends on how many customers will buy your product. We recommend that when you upload your product to Preebee, you can share its link to your friends, family, social media accounts and pages, and market so that many people know about it.`}
            />
            <Accordian
              title='How much fees is involved in the process?'
              content={`Fees change from time to time. You can get latest fees structure from the dashboard (when you are logged in).`}
            />
          </div>
        </div>
      </body>
    </BaseHtml>
  )
}
