import * as express from "express";
export interface Controller{
    router : express.IRouter,
    path : string;
    intializeRoutes() : void;
}
