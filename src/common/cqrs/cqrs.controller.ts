import { Controller, Get, Header } from '@nestjs/common';

@Controller('example')
export class ExampleController {
  @Get('your-route')
  @Header('Referrer-Policy', 'same-origin') // Change to your desired policy
  yourRoute() {
    console.log('T');
    // Your route logic here
  }
}
