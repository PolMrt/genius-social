import { Coffee } from "./entities/coffee.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateCoffeeDto } from "./dto/create-coffee.dto";

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>
  ) {}

  async findAll() {
    const coffees = await this.coffeeRepository.find();
    return coffees;
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne({ where: { id: +id } });
    if (!coffee) {
      throw new HttpException(
        `Coffee with id ${id} not found`,
        HttpStatus.NOT_FOUND
      );
    }
    return coffee;
  }

  create(createCoffeeDto: CreateCoffeeDto) {
    const coffee = this.coffeeRepository.create(createCoffeeDto);
    return this.coffeeRepository.save(coffee);
  }

  // async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
  //   const coffee = await this.coffeeRepository.preload({
  //     id: +id,
  //     ...updateCoffeeDto,
  //   });
  //   if (!coffee) {
  //     throw new NotFoundException(`Coffee #${id} not found`);
  //   }
  //   return this.coffeeRepository.save(coffee);
  // }

  // async remove(id: string) {
  //   const coffee = await this.findOne(id);
  //   return this.coffeeRepository.remove(coffee);
  // }
}
