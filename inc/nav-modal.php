<script type="text/ng-template" id="main-nav-modal.html">
<div id="main-nav-modal" class="modal fade primary-nav-modal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <div class="img-wrap">
                    <a href=<?php echo home_url(); ?>><img class="img-responsive" src="{{brandImagePath}}" /></a> 
                </div>
                <button class="btn btn-close-modal" ng-click="close()" data-dismiss="modal">
                    <i class="fa fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <nav id="main-nav" push-menu >
                    <?php include get_stylesheet_directory() . '/inc/primary-nav.php'; ?>   
                </nav>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-close-modal bottom" ng-click="close()" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div>
</script>