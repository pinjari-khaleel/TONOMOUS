package com.tonomus.core.transformer;

import org.apache.sling.rewriter.Transformer;
import org.apache.sling.rewriter.TransformerFactory;
import org.osgi.service.component.annotations.Component;

@Component(
    immediate = true,
    service = TransformerFactory.class,
    property = {
        "pipeline.type=tonomus-v2-linkrewriter"
    })
public class TargetLinkRewriterTransformerFactory implements TransformerFactory{

    @Override
    public Transformer createTransformer() {
        return new TargetLinkRewriterTransformer();
    }
}
