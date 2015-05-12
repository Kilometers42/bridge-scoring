angular.module('game.controllers', ['ejangular'])
.controller('game.controller.grid',[
    '$scope',
    'game.services.selected',
    'game.services.getGame',
    function($scope, selectedId, read){
        $scope.selectedId = selectedId;    
        $scope.loaded = false;
        // var promise = ej.DataManager({ url: "/game/read", offline: true });
        // promise.ready.done(function (e) {
        //      $scope.data = ej.DataManager({ json: e.result, updateUrl: '/game/update', adaptor: 'remoteSaveAdaptor' })
        //      $scope.loaded = true;
        //      $scope.$apply();
        //  })
        $scope.selectedId.callback = function(){
            read.query({id: $scope.selectedId.id}, function (e) {
                $scope.data = ej.DataManager({ json: e, updateUrl: '/game/update', adaptor: 'remoteSaveAdaptor' })
                $scope.loaded = true;
            //  $scope.$apply();
            })
        } 
         $scope.editSettings = { allowEditing: true, allowAdding: true, allowDeleting: true };
         $scope.toolbarSettings = { showToolbar: true, toolbarItems: [ej.Grid.ToolBarItems.Add, ej.Grid.ToolBarItems.Edit, ej.Grid.ToolBarItems.Delete, ej.Grid.ToolBarItems.Update, ej.Grid.ToolBarItems.Cancel] };
         $scope.columns = [
            { field: "number", headerText: "Board Number", isPrimaryKey: true, width: 125},
            { field: "teams", headerText: "Teams", width: 300},
            { field: "contract", headerText: "Contract", width: 80 },
            { field: "declarer", headerText: "Declarer", width: 80 },
            { field: "lead", headerText: "Lead", width: 80},
            { field: "made", headerText: "Made", width: 80 },
            { field: "score", headerText: 'Score', width: 100 },
            { field: "nsPoints", headerText: "NSpoints", width: 100 },
            { field: "ewPoints", headerText: 'EWpoints', width: 100 },
            { field: "analysis", headerText: 'Analysis',  editTemplate: {
                create: function () {
                    return "<input>";
                },
                read: function (args) {
                    
                    return args.data("ejDropDownList").getSelectedItemsID()
                    },
                write: function (args) {
                    
                    var ddl = args.element.ejDropDownList({
                        dataSource:   [{tag: 'Misplayed'} , {tag: 'Well Played'}, {tag: 'Good Defense'}, {tag: 'Misdefended'}],
                        fields: { text: "tag", value: "tag", id: "tag"  },
                        allowMultiSelection: true,
                        showCheckbox: true,
                    });
                    var test = ddl.data("ejDropDownList");
                    for(var i in args.rowdata.analysis){
                        test.setSelectedValue(args.rowdata.analysis[i]);
                    }
                    return ddl
                }
            },  width: 200 },
            { field: "notes", headerText: 'Notes' },
        ]
    }
])
        
.controller('game.controller.tab',[
    '$scope', 
    'game.services.save',
    'game.services.selected',
    function($scope, saveMatch, selectedId){
        $scope.newGame = {};
        $scope.selectedId = selectedId;
        
        $scope.updateItem = function(item){
            $scope.selectedId.id =item.data._id;
            $scope.$apply();
            $scope.selectedId.callback();
        }
        
        $scope.submit = function(newGame){
            saveMatch.post(newGame, function(){
                $scope.data = $scope.data.constructor();
            });
            
        }
        
        $scope.cols = [ { field: "team", headerText: "Pair", isPrimaryKey: true,  width: 300},
            { field: "direction", headerText: "Direction", width: 125},
            { field: "url", headerText: "Url"},];
        $scope.data = ej.DataManager({ url: "/allGames/read", offline: true });
        
    }
]);

        function boardDetails(e){
             e.detailsElement.find("#innerGrid").ejGrid({
                dataSource: e.data.result.table,
                // allowPaging: true,
                // pageSettings: { pageSize: 9 },
                columns: [
                                            { field: "teams", headerText: "teams", isPrimaryKey: true, width: 75,  textAlign: ej.TextAlign.Right },
                                            { field: "contract", headerText: "contract", width: 90 },
                                            { field: "declarer", headerText: "declarer", textAlign: ej.TextAlign.Right, width: 75 },
                                            { field: "lead", headerText: "lead", textAlign: ej.TextAlign.Right, width: 75},
                                            { field: "made", headerText: "made", width: 100 },
                                            { field: "score", headerText: 'score', width: 100 },
                                            { field: "nsPoints", headerText: "nsPoints", width: 100 },
                                            { field: "ewPoints", headerText: 'ewPoints', width: 100 }
                ]
            });
        }