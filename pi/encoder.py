import pigpio;
PI = pigpio.pi();
PI.set_mode(A, pigpio.INPUT);
PI.set_mode(B, pigpio.INPUT);

readA = PI.read(A);
readB = PI.read(B);