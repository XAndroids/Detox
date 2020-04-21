package com.wix.invoke.types;

import org.apache.commons.lang3.reflect.MethodUtils;
import java.lang.reflect.InvocationTargetException;
/**
 * Created by rotemm on 20/10/2016.
 */
public class InvocationTarget extends Target {

    public InvocationTarget(Invocation value) {
        super(value);
    }

    @Override
    public Object execute(Invocation invocation) throws NoSuchMethodException, IllegalAccessException, InvocationTargetException {
        //通过MethodUtils，使用DetoxSever返回的json数据，通过反射调用相关的方法
        //参考：http://www.xwood.net/_site_domain_/_root/5870/5874/t_c272012.html
        return  MethodUtils.invokeMethod(invocation.getTarget().getValue(), invocation.getMethod(), invocation.getArgs());
    }
}
