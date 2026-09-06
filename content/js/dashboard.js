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

    var data = {"OkPercent": 98.83900928792569, "KoPercent": 1.1609907120743035};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7786666666666666, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1388888888888889, 500, 1500, "see books"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=51f79a34-59f1-49bd-aa18-ec23b43397ac"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0341f89d-4c7c-4006-8618-05c6ce0ca64e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/427fac5a-22d8-4010-ba38-cf5faaeae04f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee42d3ef-f62b-4b18-87ad-c68f762fd3ba"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/41116476-f0b1-421b-8348-04e4778d4afb"], "isController": false}, {"data": [0.90625, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ea694253-3212-40ab-9634-217a0e82cb70"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=534b5f4c-96b8-4431-8179-338efb3619f5"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f7d325a-7e5b-4aa6-876e-3938a5046575"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ee637bd-928f-4495-b575-5bf0eebc88b8"], "isController": false}, {"data": [0.925, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b853a524-a8b9-4ff9-b75c-25fb7d538d7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b8351c46-7832-44e1-a20c-605474c17678"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.39814814814814814, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/534b5f4c-96b8-4431-8179-338efb3619f5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/966e5ffa-dc21-486d-835c-f18f280bc4dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cd56bd99-b624-4c9b-ae78-30dd6c0f1ab4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=427fac5a-22d8-4010-ba38-cf5faaeae04f"], "isController": false}, {"data": [0.29838709677419356, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0341f89d-4c7c-4006-8618-05c6ce0ca64e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bfd72940-9720-44c9-bc3c-e4a9e650d834"], "isController": false}, {"data": [0.5648148148148148, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/4143b5d6-8297-40a0-b6ab-4233e8531d50"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af2af2b8-297c-4857-8bae-819926483533"], "isController": false}, {"data": [0.9297752808988764, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee42d3ef-f62b-4b18-87ad-c68f762fd3ba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dd21dfef-031a-423a-8532-a969f4958257"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/af2af2b8-297c-4857-8bae-819926483533"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea694253-3212-40ab-9634-217a0e82cb70"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5ee637bd-928f-4495-b575-5bf0eebc88b8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f1957f9c-03de-48f5-ab35-1b624f1d01c2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/51f79a34-59f1-49bd-aa18-ec23b43397ac"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/b853a524-a8b9-4ff9-b75c-25fb7d538d7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/46640487-0de1-49e9-ba2f-153cbb924a23"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f7d325a-7e5b-4aa6-876e-3938a5046575"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b8351c46-7832-44e1-a20c-605474c17678"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1292, 15, 1.1609907120743035, 380.99613003095953, 98, 4852, 115.5, 1068.3000000000004, 1256.7499999999995, 1953.2599999999989, 5.0122785306109785, 690.14244362399, 3.6504889529594555], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1686.7592592592591, 1246, 2327, 1652.5, 2045.5, 2106.0, 2327.0, 0.23796618236141776, 286.3545975328085, 1.1700778595602914], "isController": true}, {"data": ["deleteBook", 12, 1, 8.333333333333334, 708.5833333333333, 312, 1952, 520.0, 1669.400000000001, 1952.0, 1952.0, 0.08646654465276477, 0.01644468708117767, 0.05842543296320848], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, 8.333333333333334, 708.5833333333333, 312, 1952, 520.0, 1669.400000000001, 1952.0, 1952.0, 0.08581174333707568, 0.016320153334858874, 0.05798298379945795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 165.3, 100, 322, 104.5, 312.7, 321.55, 322.0, 0.09411188962557585, 0.032249865302357975, 0.05327799064057258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 127.6, 102, 319, 106.5, 280.4000000000003, 317.9, 319.0, 0.0941096754157295, 0.06993892870250991, 0.04723864566766109], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 167.0, 99, 607, 103.0, 310.20000000000005, 592.1999999999998, 607.0, 0.09411188962557585, 1.4076988084258375, 0.05501501672838838], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 204.85, 99, 1127, 103.5, 312.6, 1086.2999999999993, 1127.0, 0.09411233248004819, 4.258220013752164, 0.05492336903327812], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=51f79a34-59f1-49bd-aa18-ec23b43397ac", 1, 0, 0.0, 941.0, 941, 941, 941.0, 941.0, 941.0, 941.0, 1.0626992561105206, 0.19199156482465463, 0.7326813230605739], "isController": false}, {"data": ["goToProfile", 12, 1, 8.333333333333334, 284.6666666666666, 104, 497, 237.0, 476.9000000000001, 497.0, 497.0, 0.08680995131408564, 0.1717265866327143, 0.05611421250714373], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0341f89d-4c7c-4006-8618-05c6ce0ca64e", 1, 0, 0.0, 538.0, 538, 538, 538.0, 538.0, 538.0, 538.0, 1.858736059479554, 0.3358068076208178, 1.2815113847583641], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 115.77777777777779, 100, 300, 105.0, 134.40000000000026, 300.0, 300.0, 0.10072014906582061, 0.07485159515536083, 0.050556793574054494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 125.05555555555556, 99, 307, 103.0, 298.0, 307.0, 307.0, 0.10072803988830378, 0.03535755306409101, 0.05697648350018746], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 3, 0, 0.0, 671.3333333333334, 606, 797, 611.0, 797.0, 797.0, 797.0, 0.03542372681221882, 10.415751861221647, 0.02020259419759355], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 3, 0, 0.0, 1046.6666666666667, 909, 1116, 1115.0, 1116.0, 1116.0, 1116.0, 0.03521168088827333, 31.68353235880116, 0.020047275349475934], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 3, 0, 0.0, 173.0, 104, 299, 116.0, 299.0, 299.0, 299.0, 0.03555260600602024, 0.0629114473465905, 0.019685866802161597], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 129.9375, 100, 323, 103.5, 307.6, 323.0, 323.0, 0.08475474096832292, 0.06298667761415404, 0.04254290708761521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 115.875, 99, 305, 102.0, 168.50000000000014, 305.0, 305.0, 0.0847574348162353, 0.022679235487937956, 0.048338224543634185], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 147.50000000000003, 99, 407, 103.0, 337.00000000000006, 407.0, 407.0, 0.0847565368479044, 0.02284453532228673, 0.04982757342035004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 153.49999999999997, 99, 306, 103.0, 303.9, 306.0, 306.0, 0.08475698582969142, 0.02284465633690902, 0.04991060786650774], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/427fac5a-22d8-4010-ba38-cf5faaeae04f", 3, 0, 0.0, 303.0, 199, 480, 230.0, 480.0, 480.0, 480.0, 0.06284960090503425, 0.04040623756101649, 0.04030394328871012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 3, 0, 0.0, 174.66666666666666, 104, 312, 108.0, 312.0, 312.0, 312.0, 0.035546708374804496, 0.02641703620432248, 0.019960309878430258], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 746.5882352941176, 101, 1341, 1110.0, 1323.4, 1341.0, 1341.0, 0.09646594184806047, 51.06966144355607, 0.051834927622171276], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 146.3888888888889, 99, 702, 103.0, 337.50000000000057, 702.0, 702.0, 0.10072747621712368, 5.060905366885843, 0.05873583519865697], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 523.1176470588235, 99, 919, 787.0, 844.5999999999999, 919.0, 919.0, 0.09646648924398644, 16.695618435313545, 0.051929427315337603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 135.16666666666666, 100, 494, 103.0, 319.40000000000026, 494.0, 494.0, 0.10072973093969646, 1.6710795673937862, 0.05883551884205578], "isController": false}, {"data": ["deleteBooks", 12, 1, 8.333333333333334, 547.5, 108, 1071, 482.0, 1032.0000000000002, 1071.0, 1071.0, 0.08587560918010262, 0.016332299695141588, 0.05869704113799495], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee42d3ef-f62b-4b18-87ad-c68f762fd3ba", 1, 0, 0.0, 599.0, 599, 599, 599.0, 599.0, 599.0, 599.0, 1.669449081803005, 0.3016094532554257, 1.1510068864774625], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41116476-f0b1-421b-8348-04e4778d4afb", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.6237030029296875, 1.1653900146484375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 304.9375, 203, 631, 214.5, 614.9, 631.0, 631.0, 0.08470807479723004, 0.13128097138984773, 0.19051044556447344], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea694253-3212-40ab-9634-217a0e82cb70", 3, 0, 0.0, 506.33333333333337, 218, 980, 321.0, 980.0, 980.0, 980.0, 0.02952523423352492, 0.024613972940122825, 0.018933825338556018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 790.7272727272727, 167, 1541, 735.5, 1509.7, 1539.05, 1541.0, 0.09549771673640893, 0.05866021858125119, 0.0431791434071849], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 107.41176470588235, 100, 132, 104.0, 122.39999999999999, 132.0, 132.0, 0.09646429969755606, 0.07168880084945328, 0.048420556684124816], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 116.47058823529412, 100, 309, 104.0, 156.99999999999986, 309.0, 309.0, 0.09646484707484537, 0.11103875262441129, 0.050249496396754245], "isController": false}, {"data": ["login", 22, 0, 0.0, 3339.9545454545455, 1761, 6603, 3140.0, 4874.2, 6348.899999999996, 6603.0, 0.09477121367462457, 15.594218706922176, 0.1644193055423929], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 112.83333333333333, 102, 139, 110.0, 139.0, 139.0, 139.0, 0.10028469711235787, 0.0811875135802194, 0.03564807592665846], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=534b5f4c-96b8-4431-8179-338efb3619f5", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f7d325a-7e5b-4aa6-876e-3938a5046575", 3, 0, 0.0, 407.6666666666667, 242, 578, 403.0, 578.0, 578.0, 578.0, 0.026999055033073843, 0.027078153827116053, 0.01731384714035009], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 867.7058823529411, 202, 1463, 1215.0, 1440.6, 1463.0, 1463.0, 0.0964074063572178, 67.90668440929197, 0.2023126701307171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ee637bd-928f-4495-b575-5bf0eebc88b8", 1, 0, 0.0, 837.0, 837, 837, 837.0, 837.0, 837.0, 837.0, 1.194743130227001, 0.21584714755077658, 0.823719384707288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 385.3, 207, 1231, 406.0, 629.6, 1201.0499999999997, 1231.0, 0.09406408586169758, 5.765159346031201, 0.21034897481904422], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, 40.0, 774.4, 103, 1428, 1017.0, 1428.0, 1428.0, 1428.0, 0.05847132566189541, 41.97747830713818, 0.09460477769201983], "isController": false}, {"data": ["register", 22, 3, 13.636363636363637, 1408.409090909091, 186, 3811, 1252.5, 2103.7, 3563.4999999999964, 3811.0, 0.09762938111847769, 0.0311852373281501, 0.04404763093431317], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 275.4444444444444, 203, 806, 210.5, 621.5000000000003, 806.0, 806.0, 0.10066157020864906, 6.837685096705011, 0.22495938585257552], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 119.93333333333334, 103, 305, 106.0, 191.60000000000008, 305.0, 305.0, 0.07818934331376863, 0.06070364056098247, 0.02779386813106619], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 467.66666666666663, 206, 1242, 405.0, 1105.2, 1242.0, 1242.0, 0.07759155803848541, 18.66149712911235, 0.1705347270716946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b853a524-a8b9-4ff9-b75c-25fb7d538d7b", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 0.8364076967592593, 3.191912615740741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 102.8888888888889, 100, 105, 103.0, 105.0, 105.0, 105.0, 0.0586403263008379, 0.04357938312005629, 0.029434695037725275], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 147.55555555555554, 99, 306, 102.0, 306.0, 306.0, 306.0, 0.05864147255253299, 0.01569117527284574, 0.03344396481511647], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b8351c46-7832-44e1-a20c-605474c17678", 1, 0, 0.0, 489.0, 489, 489, 489.0, 489.0, 489.0, 489.0, 2.044989775051125, 0.36945616053169733, 1.409924591002045], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 147.0, 99, 302, 105.0, 302.0, 302.0, 302.0, 0.05864147255253299, 0.015805709398924908, 0.03447477194982897], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 146.55555555555554, 98, 301, 104.0, 301.0, 301.0, 301.0, 0.05864223674522555, 0.01580591537273657, 0.03453248902087012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 108.0, 108, 108, 108.0, 108.0, 108.0, 108.0, 9.25925925925926, 2.730758101851852, 5.723741319444445], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1173.277777777778, 793, 1878, 1142.0, 1616.0, 1647.75, 1878.0, 0.23821602664490374, 284.9891851578181, 0.4703835994882767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, 13.636363636363637, 1408.409090909091, 186, 3811, 1252.5, 2103.7, 3563.4999999999964, 3811.0, 0.09541860576068145, 0.030479061037547224, 0.04305019127093246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 102.5, 99, 105, 102.5, 105.0, 105.0, 105.0, 0.03905944848058745, 0.010527741973283338, 0.023000827572064682], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/534b5f4c-96b8-4431-8179-338efb3619f5", 3, 0, 0.0, 480.6666666666667, 228, 657, 557.0, 657.0, 657.0, 657.0, 0.01806858836141995, 0.024909007718298664, 0.011586952822915789], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 134.0, 100, 294, 102.5, 294.0, 294.0, 294.0, 0.03905970275566203, 0.010527810508362032, 0.022962833065340374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 248.33333333333331, 99, 1089, 104.0, 967.2, 1089.0, 1089.0, 0.07781455235881846, 9.353866459204424, 0.04485482074120955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 207.8, 100, 785, 104.0, 781.4, 785.0, 785.0, 0.07781616708687397, 3.0689156187422832, 0.044931743873273776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/966e5ffa-dc21-486d-835c-f18f280bc4dc", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.698765727571116, 1.3056448304157549], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 117.60000000000001, 99, 310, 103.0, 190.00000000000006, 310.0, 310.0, 0.0778941574188992, 0.057888138472443645, 0.03909921573565839], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 134.5, 99, 298, 102.5, 298.0, 298.0, 298.0, 0.03906021131574322, 0.010451658105970353, 0.022276526766009802], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 130.33333333333334, 99, 305, 103.0, 304.4, 305.0, 305.0, 0.07789698902171768, 0.03644321374414474, 0.04355334255979892], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 135.66666666666666, 99, 298, 104.5, 298.0, 298.0, 298.0, 0.03905893994037002, 0.02902720048302889, 0.019605756962256044], "isController": false}, {"data": ["deleteAccount", 12, 1, 8.333333333333334, 577.4166666666666, 103, 980, 617.5, 913.1000000000003, 980.0, 980.0, 0.08660070579575224, 0.016272870254100902, 0.05893894063882454], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 108.33333333333333, 105, 121, 106.0, 121.0, 121.0, 121.0, 0.03918392936443667, 0.03084203815208589, 0.013928662391264597], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 2034.8636363636356, 1047, 4852, 1722.5, 3496.8999999999996, 4676.049999999997, 4852.0, 0.0937478693666053, 0.04852184644951251, 0.04312035788249131], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 272.5, 202, 597, 210.0, 597.0, 597.0, 597.0, 0.03903276800874334, 0.060493166826050465, 0.08778561008216397], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cd56bd99-b624-4c9b-ae78-30dd6c0f1ab4", 1, 0, 0.0, 319.0, 319, 319, 319.0, 319.0, 319.0, 319.0, 3.134796238244514, 1.0010530956112853, 1.8704692398119123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=427fac5a-22d8-4010-ba38-cf5faaeae04f", 1, 0, 0.0, 420.0, 420, 420, 420.0, 420.0, 420.0, 420.0, 2.3809523809523814, 0.43015252976190477, 1.6415550595238095], "isController": false}, {"data": ["addBook", 62, 8, 12.903225806451612, 1116.0, 529, 2623, 867.5, 1836.4, 2015.8499999999992, 2623.0, 0.29019288465768944, 96.3007428001741, 1.054051788898718], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 188.75925925925924, 101, 428, 105.5, 413.0, 423.25, 428.0, 0.23894756870848838, 0.1775772458858981, 0.11550688135810717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0341f89d-4c7c-4006-8618-05c6ce0ca64e", 3, 0, 0.0, 414.3333333333333, 202, 595, 446.0, 595.0, 595.0, 595.0, 0.044973465655263396, 0.028913605035529037, 0.028840406035439088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bfd72940-9720-44c9-bc3c-e4a9e650d834", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.7176088483146067, 1.3408532303370786], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 662.0925925925925, 488, 985, 602.0, 867.5, 930.75, 985.0, 0.2387985778218032, 70.21471073863938, 0.1200988941193639], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4143b5d6-8297-40a0-b6ab-4233e8531d50", 1, 0, 0.0, 576.0, 576, 576, 576.0, 576.0, 576.0, 576.0, 1.736111111111111, 0.5544026692708334, 1.0359022352430556], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 150.22222222222217, 100, 314, 107.0, 306.5, 309.75, 314.0, 0.23931608780241356, 0.4234772959941146, 0.11638614426328316], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 982.9074074074075, 690, 1417, 1000.5, 1224.5, 1273.0, 1417.0, 0.23870146403564607, 214.7839969316916, 0.11981694581476766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 109.60000000000001, 104, 126, 107.0, 120.0, 126.0, 126.0, 0.08242573441329362, 0.06157781916618127, 0.029299772779725466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af2af2b8-297c-4857-8bae-819926483533", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, 4.49438202247191, 187.9325842696629, 100, 1140, 110.0, 376.99999999999983, 546.7999999999997, 974.1000000000017, 0.7376067561463776, 1.5302005679157638, 0.35768294615885066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 152.22222222222223, 100, 315, 110.0, 315.0, 315.0, 315.0, 0.05880700195369929, 0.0455409692864097, 0.020904051475729043], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee42d3ef-f62b-4b18-87ad-c68f762fd3ba", 3, 0, 0.0, 472.0, 238, 757, 421.0, 757.0, 757.0, 757.0, 0.05170274369226527, 0.033845773946987456, 0.03315573081828209], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 120.3, 102, 312, 108.0, 126.20000000000002, 302.7499999999999, 312.0, 0.09505432354590648, 0.07713881139321122, 0.033788841572958944], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dd21dfef-031a-423a-8532-a969f4958257", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.33056640625, 2.4861653645833335], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af2af2b8-297c-4857-8bae-819926483533", 3, 0, 0.0, 337.3333333333333, 236, 454, 322.0, 454.0, 454.0, 454.0, 0.01918465227817746, 0.026447591926458833, 0.012302657873701038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 317.44444444444446, 203, 411, 394.0, 411.0, 411.0, 411.0, 0.05860138038807137, 0.09082069401940356, 0.13179587796262532], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea694253-3212-40ab-9634-217a0e82cb70", 1, 0, 0.0, 460.0, 460, 460, 460.0, 460.0, 460.0, 460.0, 2.1739130434782608, 0.39274796195652173, 1.4988111413043477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 380.8666666666666, 201, 1191, 215.0, 1068.0, 1191.0, 1191.0, 0.07776977037179135, 12.509748562231369, 0.17225295298298915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ee637bd-928f-4495-b575-5bf0eebc88b8", 3, 0, 0.0, 355.3333333333333, 206, 444, 416.0, 444.0, 444.0, 444.0, 0.03201468406842605, 0.026689324836991903, 0.020530249874609156], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f1957f9c-03de-48f5-ab35-1b624f1d01c2", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/51f79a34-59f1-49bd-aa18-ec23b43397ac", 3, 0, 0.0, 572.0, 497, 686, 533.0, 686.0, 686.0, 686.0, 0.028446265005404793, 0.023714480689727105, 0.018241908222867004], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b853a524-a8b9-4ff9-b75c-25fb7d538d7b", 3, 0, 0.0, 555.0, 245, 758, 662.0, 758.0, 758.0, 758.0, 0.10055304172951231, 0.04549763281380928, 0.06448225657784482], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 123.43749999999999, 103, 344, 107.0, 197.70000000000016, 344.0, 344.0, 0.08629709933874848, 0.07154905990097407, 0.030675922030570745], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/46640487-0de1-49e9-ba2f-153cbb924a23", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 122.29411764705883, 102, 313, 108.0, 166.59999999999985, 313.0, 313.0, 0.09819948358624514, 0.07623885688580556, 0.03490684768104808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f7d325a-7e5b-4aa6-876e-3938a5046575", 1, 0, 0.0, 1071.0, 1071, 1071, 1071.0, 1071.0, 1071.0, 1071.0, 0.9337068160597572, 0.168687266573296, 0.6437470821661998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b8351c46-7832-44e1-a20c-605474c17678", 3, 0, 0.0, 492.3333333333333, 365, 682, 430.0, 682.0, 682.0, 682.0, 0.03138699113840617, 0.031478945214006966, 0.02012772543706385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 119.46666666666665, 100, 314, 104.0, 197.00000000000006, 314.0, 314.0, 0.07771698582442178, 0.0577564709105322, 0.03901028390014921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 171.46666666666667, 99, 349, 103.0, 324.40000000000003, 349.0, 349.0, 0.07771698582442178, 0.04414081929246456, 0.04301756598172096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 332.53333333333336, 101, 1135, 107.0, 1000.0000000000001, 1135.0, 1135.0, 0.07771698582442178, 14.002733816409163, 0.04435332667557821], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 271.26666666666665, 99, 818, 105.0, 811.4, 818.0, 818.0, 0.07763292049871388, 4.582070854919598, 0.044381163730417096], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 20.0, 0.23219814241486067], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 6.666666666666667, 0.07739938080495357], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 6.666666666666667, 0.07739938080495357], "isController": false}, {"data": ["401/Unauthorized", 10, 66.66666666666667, 0.7739938080495357], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1292, 15, "401/Unauthorized", 10, "406/Not Acceptable", 3, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 178, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
