package com.wix.invoke.types;

import org.apache.commons.lang3.reflect.MethodUtils;
import java.lang.reflect.InvocationTargetException;

/**
 * Action调用Target，使用DetoxServer Action Json解析的Incocation，使用MethodUtils反射调用真正的Native方法执行
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
