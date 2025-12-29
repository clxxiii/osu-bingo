The goal is to have a functional version of this whole app that is written in rust. The frontend would become a site served with NGINX built without any server functions. I want to do this for several reasons:

- The current app is monolithic. When the osu! bot starts glitching, the whole app has to go down. Ideally this would be separated into several microservices
- Rust microservices are smaller. The current app fits in a single 400 MB dockerfile. Rewriting it in rust would let us get 3-4 services, each with only 20-30 MB each. These could then be run on a single machine with less ram, or multiple machine to scale horizontally if traffic increases.
- Rust’s packaging system seems like it will translate quite nicely to the design I’m looking for. Rather than having 5 different repos each in their own folder, I can have them all combined together in the same project and export each service as a binary.
- I want practice building a microservice app where the services are actually micro. Every “microservices” project I’ve done in the past has had two microservices, where one is the “frontend” and one is the “backend”.
- I want practice with RabbitMQ and horizontal scaling, as none of the services I’ve made before have actually been able to successfully scale horizontally.

Okay so now that I’ve convinced myself _why_ I want to go through all this, I’m gonna start planning the how.