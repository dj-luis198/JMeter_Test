/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 67.79935275080906, "KoPercent": 32.200647249190936};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5119331742243437, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d8b3b3d9-f2bb-47b3-9543-2329f6b11fb7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92ad2b6b-3e47-4604-ac19-8b0050fb1952"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=76d58d17-f3bd-4c89-b7cd-50729eac2511"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=203a68a5-fa01-4a80-bb21-cb5bf4ece330"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bb5bf44e-0f1b-46eb-a795-f4f7a88dfaff"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/df90accd-0b76-4f35-8ebc-801f057af7be"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/92ad2b6b-3e47-4604-ac19-8b0050fb1952"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/4cdba52c-89bd-46e1-af59-b9770a3ba6b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bb5bf44e-0f1b-46eb-a795-f4f7a88dfaff"], "isController": false}, {"data": [0.42105263157894735, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=df90accd-0b76-4f35-8ebc-801f057af7be"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/203a68a5-fa01-4a80-bb21-cb5bf4ece330"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09f00017-a083-4e3e-af13-10abd6e9d3f4"], "isController": false}, {"data": [0.0, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a7ea3ba9-5909-4aaa-972c-0f93b3ca3dd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/42fec589-3606-4437-8d5b-1fb449a25724"], "isController": false}, {"data": [0.7, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9419889502762431, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/76d58d17-f3bd-4c89-b7cd-50729eac2511"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=42fec589-3606-4437-8d5b-1fb449a25724"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3ecdf6f9-4761-43a3-b9c0-8acf389ed590"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8113364-5a00-40db-8b2e-cc7d77cf25e6"], "isController": false}, {"data": [0.02631578947368421, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ecdf6f9-4761-43a3-b9c0-8acf389ed590"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c0444c59-a05d-4a7d-b38b-31a02e1a4df5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=53d8d327-6717-4972-9238-a19f1d7f2f2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53d8d327-6717-4972-9238-a19f1d7f2f2a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=446a9bde-951f-4e7a-9130-8fc075d04413"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b8113364-5a00-40db-8b2e-cc7d77cf25e6"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d8b3b3d9-f2bb-47b3-9543-2329f6b11fb7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4cdba52c-89bd-46e1-af59-b9770a3ba6b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45554032-6904-44a4-afb7-cc97d19eaacf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45554032-6904-44a4-afb7-cc97d19eaacf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/299337fd-dd73-4648-b9ad-b3f49a1157a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/446a9bde-951f-4e7a-9130-8fc075d04413"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.38636363636363635, 500, 1500, "register"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 618, 199, 32.200647249190936, 304.6343042071196, 138, 2727, 154.0, 603.3000000000001, 997.1999999999989, 1422.2199999999966, 2.3911781775972143, 2.502301128119559, 1.145784212371832], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 59, 100.0, 817.7966101694915, 563, 1165, 885.0, 1055.0, 1086.0, 1165.0, 0.2577938959648701, 1.6583918535490354, 0.43276143277696455], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 18, 100.0, 193.66666666666669, 138, 444, 150.0, 434.1, 444.0, 444.0, 0.08100627798654396, 0.04026581591323327, 0.040661354379964446], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 220.1764705882353, 142, 447, 154.0, 445.4, 447.0, 447.0, 0.13773435094712622, 0.10693243066695834, 0.04896025756323627], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, 100.0, 147.23529411764704, 138, 154, 148.0, 153.2, 154.0, 154.0, 0.09532300480540089, 0.04738223578705962, 0.04784768014646099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d8b3b3d9-f2bb-47b3-9543-2329f6b11fb7", 3, 0, 0.0, 333.6666666666667, 238, 506, 257.0, 506.0, 506.0, 506.0, 0.018621511570165856, 0.02233732751824908, 0.011941529229565994], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92ad2b6b-3e47-4604-ac19-8b0050fb1952", 1, 0, 0.0, 1079.0, 1079, 1079, 1079.0, 1079.0, 1079.0, 1079.0, 0.9267840593141798, 0.1674365732159407, 0.6389741658943466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=76d58d17-f3bd-4c89-b7cd-50729eac2511", 1, 0, 0.0, 390.0, 390, 390, 390.0, 390.0, 390.0, 390.0, 2.5641025641025643, 0.4632411858974359, 1.7678285256410255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=203a68a5-fa01-4a80-bb21-cb5bf4ece330", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 166.0, 154, 178, 166.0, 178.0, 178.0, 178.0, 0.2039983680130559, 0.06016358119135047, 0.12610445991432068], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bb5bf44e-0f1b-46eb-a795-f4f7a88dfaff", 3, 0, 0.0, 502.6666666666667, 244, 817, 447.0, 817.0, 817.0, 817.0, 0.023334681559378987, 0.027580803626987338, 0.014963972223950718], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, 100.0, 280.9152542372881, 139, 634, 152.0, 596.0, 621.0, 634.0, 0.25867662790901597, 0.1285804722711808, 0.1250438777489872], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 573.2666666666667, 150, 996, 528.0, 955.8000000000001, 996.0, 996.0, 0.07093842072158561, 0.013896725778076244, 0.04776335593116136], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 573.2666666666667, 150, 996, 528.0, 955.8000000000001, 996.0, 996.0, 0.07147724402807626, 0.014002280421906346, 0.048126149592341454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/df90accd-0b76-4f35-8ebc-801f057af7be", 3, 0, 0.0, 456.6666666666667, 317, 545, 508.0, 545.0, 545.0, 545.0, 0.02298075744576541, 0.023048083883594802, 0.01473700916932222], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, 18.181818181818183, 1029.8181818181822, 454, 2161, 1044.5, 1640.4999999999998, 2096.199999999999, 2161.0, 0.08696133382874942, 0.027638634153668584, 0.03923450803601781], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92ad2b6b-3e47-4604-ac19-8b0050fb1952", 2, 0, 0.0, 235.5, 215, 256, 235.5, 256.0, 256.0, 256.0, 0.027725023219706945, 0.032070595706780156, 0.017233376249358858], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4cdba52c-89bd-46e1-af59-b9770a3ba6b6", 3, 0, 0.0, 377.6666666666667, 250, 592, 291.0, 592.0, 592.0, 592.0, 0.017049523181668354, 0.023504144099728345, 0.010933450738244354], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 191.85714285714286, 140, 415, 159.0, 415.0, 415.0, 415.0, 0.03413651680735788, 0.02686917240891646, 0.012134464958865497], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 495.92857142857144, 148, 1081, 456.0, 966.0, 1081.0, 1081.0, 0.06712085109239185, 0.015160248035516518, 0.044872086835203925], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bb5bf44e-0f1b-46eb-a795-f4f7a88dfaff", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1274.6315789473683, 788, 2727, 1201.0, 1975.0, 2727.0, 2727.0, 0.09069645329132656, 0.04694250023867488, 0.04171682568380352], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 267.7333333333334, 149, 508, 255.0, 400.00000000000006, 508.0, 508.0, 0.07052451432117804, 0.14849634389163674, 0.04479408604931074], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, 100.0, 148.57142857142858, 139, 158, 150.0, 158.0, 158.0, 158.0, 0.0346424895082746, 0.01721975308565603, 0.01738890586645815], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=df90accd-0b76-4f35-8ebc-801f057af7be", 1, 0, 0.0, 1146.0, 1146, 1146, 1146.0, 1146.0, 1146.0, 1146.0, 0.8726003490401396, 0.1576475239965096, 0.6016170375218151], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/203a68a5-fa01-4a80-bb21-cb5bf4ece330", 3, 0, 0.0, 397.6666666666667, 314, 456, 423.0, 456.0, 456.0, 456.0, 0.02917862179643048, 0.029264106039974713, 0.01871155108690366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09f00017-a083-4e3e-af13-10abd6e9d3f4", 1, 0, 0.0, 338.0, 338, 338, 338.0, 338.0, 338.0, 338.0, 2.9585798816568047, 0.9447808801775147, 1.7653245192307692], "isController": false}, {"data": ["addBook", 61, 61, 100.0, 826.1311475409838, 591, 1396, 754.0, 1069.8000000000002, 1141.3, 1396.0, 0.2822571316197395, 0.8866987772713602, 0.5523724709645328], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/a7ea3ba9-5909-4aaa-972c-0f93b3ca3dd7", 1, 0, 0.0, 315.0, 315, 315, 315.0, 315.0, 315.0, 315.0, 3.1746031746031744, 1.013764880952381, 1.8942212301587302], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 166.47058823529412, 140, 420, 152.0, 217.59999999999982, 420.0, 420.0, 0.09342301943198804, 0.06979356432174888, 0.0332089639387145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/42fec589-3606-4437-8d5b-1fb449a25724", 3, 0, 0.0, 520.0, 255, 851, 454.0, 851.0, 851.0, 851.0, 0.07830649160815431, 0.035431648221137535, 0.05021607697528125], "isController": false}, {"data": ["deleteBooks", 15, 2, 13.333333333333334, 518.6666666666665, 154, 1146, 439.0, 1105.8, 1146.0, 1146.0, 0.07168287496117177, 0.014042563200401424, 0.048740621490525916], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 6, 3.314917127071823, 223.13259668508283, 139, 946, 155.0, 420.40000000000003, 507.9000000000003, 853.3400000000008, 0.7574933248516401, 1.6219546270391636, 0.3641357840788295], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 17, 0, 0.0, 168.52941176470586, 143, 421, 153.0, 216.99999999999983, 421.0, 421.0, 0.08316048996203969, 0.06440065287099361, 0.02956095541619379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/76d58d17-f3bd-4c89-b7cd-50729eac2511", 3, 0, 0.0, 587.6666666666666, 240, 1081, 442.0, 1081.0, 1081.0, 1081.0, 0.024722897523589766, 0.024795327887428407, 0.01585420186245828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, 100.0, 171.2857142857143, 144, 452, 150.0, 304.5, 452.0, 452.0, 0.07622698217377574, 0.037890169850050635, 0.038262371911446026], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=42fec589-3606-4437-8d5b-1fb449a25724", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 0.5267173833819242, 2.0100674198250728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ecdf6f9-4761-43a3-b9c0-8acf389ed590", 3, 0, 0.0, 319.6666666666667, 237, 476, 246.0, 476.0, 476.0, 476.0, 0.017129740655726474, 0.023614730363607297, 0.010984892282480844], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 152.1764705882353, 141, 178, 152.0, 171.6, 178.0, 178.0, 0.11456065986940085, 0.09296866049948448, 0.040722734562951085], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 488.10526315789485, 190, 1350, 486.0, 687.0, 1350.0, 1350.0, 0.0909090909090909, 0.055841619318181816, 0.04110440340909091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8113364-5a00-40db-8b2e-cc7d77cf25e6", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.4271018026004728, 1.6299128250591017], "isController": false}, {"data": ["login", 19, 2, 10.526315789473685, 2085.5789473684213, 1461, 4394, 1968.0, 2597.0, 4394.0, 4394.0, 0.0910231965430348, 0.13379324500091022, 0.13699795766702758], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 17, 100.0, 166.7058823529412, 141, 444, 150.0, 211.9999999999998, 444.0, 444.0, 0.08253068199471804, 0.04102355188995262, 0.04142653373562995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 183.33333333333334, 140, 451, 151.5, 434.8, 451.0, 451.0, 0.07996836806774209, 0.06474001672671699, 0.0284262558365802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, 100.0, 182.64705882352945, 138, 450, 150.0, 445.2, 450.0, 450.0, 0.14233326077127884, 0.07074963841072356, 0.07144462503558331], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ecdf6f9-4761-43a3-b9c0-8acf389ed590", 1, 0, 0.0, 452.0, 452, 452, 452.0, 452.0, 452.0, 452.0, 2.2123893805309733, 0.3996992533185841, 1.5253387721238938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c0444c59-a05d-4a7d-b38b-31a02e1a4df5", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 1.2235093390804597, 2.286129070881226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=53d8d327-6717-4972-9238-a19f1d7f2f2a", 1, 0, 0.0, 775.0, 775, 775, 775.0, 775.0, 775.0, 775.0, 1.2903225806451613, 0.2331149193548387, 0.889616935483871], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53d8d327-6717-4972-9238-a19f1d7f2f2a", 3, 0, 0.0, 342.0, 275, 423, 328.0, 423.0, 423.0, 423.0, 0.02740877446233121, 0.02284956751237963, 0.017576590394138177], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=446a9bde-951f-4e7a-9130-8fc075d04413", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.2498811376210235, 0.953600449515906], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 195.5, 146, 452, 153.5, 434.0, 452.0, 452.0, 0.08049215201517852, 0.06673616900477203, 0.02861244466164549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 13, 100.0, 168.15384615384616, 139, 428, 148.0, 317.5999999999999, 428.0, 428.0, 0.07596164521237123, 0.037758278723727494, 0.03812918519449102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8113364-5a00-40db-8b2e-cc7d77cf25e6", 3, 0, 0.0, 352.6666666666667, 226, 465, 367.0, 465.0, 465.0, 465.0, 0.04144734115306503, 0.02664664673740346, 0.02657918687224548], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d8b3b3d9-f2bb-47b3-9543-2329f6b11fb7", 1, 0, 0.0, 553.0, 553, 553, 553.0, 553.0, 553.0, 553.0, 1.8083182640144664, 0.32669812386980107, 1.246750678119349], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 149.0769230769231, 140, 160, 149.0, 158.4, 160.0, 160.0, 0.07425770852135766, 0.05765124831492123, 0.026396294825951357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4cdba52c-89bd-46e1-af59-b9770a3ba6b6", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45554032-6904-44a4-afb7-cc97d19eaacf", 1, 0, 0.0, 259.0, 259, 259, 259.0, 259.0, 259.0, 259.0, 3.8610038610038613, 0.6975446428571428, 2.6619811776061777], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45554032-6904-44a4-afb7-cc97d19eaacf", 3, 0, 0.0, 301.3333333333333, 233, 391, 280.0, 391.0, 391.0, 391.0, 0.10728078958661136, 0.04854176351737949, 0.06879660009297668], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/299337fd-dd73-4648-b9ad-b3f49a1157a0", 1, 0, 0.0, 321.0, 321, 321, 321.0, 321.0, 321.0, 321.0, 3.115264797507788, 0.9948160046728972, 1.8588152258566977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/446a9bde-951f-4e7a-9130-8fc075d04413", 3, 0, 0.0, 335.0, 256, 442, 307.0, 442.0, 442.0, 442.0, 0.025674600118103158, 0.02574981867313667, 0.01646450593511173], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, 100.0, 164.0, 140, 414, 149.0, 215.59999999999982, 414.0, 414.0, 0.1190526212585963, 0.0591775236529546, 0.059758835280193844], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, 100.0, 151.16666666666669, 148, 156, 151.0, 156.0, 156.0, 156.0, 0.04932101404004866, 0.024516011861703876, 0.028256830960444547], "isController": false}, {"data": ["register", 22, 4, 18.181818181818183, 1029.8181818181822, 454, 2161, 1044.5, 1640.4999999999998, 2096.199999999999, 2161.0, 0.09040290932999116, 0.02873245875367262, 0.04078725010786711], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 2.0100502512562812, 0.6472491909385113], "isController": false}, {"data": ["401/Unauthorized", 10, 5.025125628140704, 1.6181229773462784], "isController": false}, {"data": ["404/Not Found", 185, 92.96482412060301, 29.93527508090615], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 618, 199, "404/Not Found", 185, "401/Unauthorized", 10, "406/Not Acceptable", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 18, "404/Not Found", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 59, 59, "404/Not Found", 59, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 7, "404/Not Found", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 14, "404/Not Found", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 13, "404/Not Found", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 17, "404/Not Found", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 6, "404/Not Found", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
