import { PartialType } from "@nestjs/mapped-types";
import { CreateCoffeeDto } from "./create-coffee.dto";

// All fields optionals with PartialType
export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
