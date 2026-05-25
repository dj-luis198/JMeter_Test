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

    var data = {"OkPercent": 99.5475113122172, "KoPercent": 0.45248868778280543};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7991536458333334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.12280701754385964, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/e514d266-c102-4dce-9908-77345cf465d0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7de6fce8-1484-4489-aebd-04e85b5cec36"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.75, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2151661f-bc87-4a62-9ed0-1f5bcb2a96ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8171d83c-c4ce-4bff-9cdf-80585a4200cc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd2e73cb-4708-4bfd-a4f6-b6eb3e672568"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fdd6cc00-47d2-49ed-bde5-c49775eab9da"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/026fdf1b-43ed-43ef-993c-9567f9238951"], "isController": false}, {"data": [0.775, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/83eb6028-3da5-4927-898c-a2d2d29c1e95"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a22e4b2a-f211-4062-a27e-5dd7acb53986"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/34429699-fcf1-49d9-bf7e-51e4354d91e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd890725-4b2d-4f9b-80e8-5904d272cde7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fd52ba64-1dd7-43c7-b58c-56f7d1ebe251"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80bd3191-5c29-4f46-9fb5-3901b9d1544c"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/395b04be-eb94-4ab0-8ce3-bbfb99e44e4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32e12870-7510-4f15-93dd-b4d67ba54d29"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "register"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9210526315789473, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e514d266-c102-4dce-9908-77345cf465d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fd52ba64-1dd7-43c7-b58c-56f7d1ebe251"], "isController": false}, {"data": [0.35964912280701755, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/5a58939d-e872-40cd-a899-f029ab181526"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2151661f-bc87-4a62-9ed0-1f5bcb2a96ce"], "isController": false}, {"data": [0.3412698412698413, 500, 1500, "addBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fd890725-4b2d-4f9b-80e8-5904d272cde7"], "isController": false}, {"data": [0.9912280701754386, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.543859649122807, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7de6fce8-1484-4489-aebd-04e85b5cec36"], "isController": false}, {"data": [0.9644808743169399, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a22e4b2a-f211-4062-a27e-5dd7acb53986"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8823529411764706, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=026fdf1b-43ed-43ef-993c-9567f9238951"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80bd3191-5c29-4f46-9fb5-3901b9d1544c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=395b04be-eb94-4ab0-8ce3-bbfb99e44e4b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=34429699-fcf1-49d9-bf7e-51e4354d91e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fdd6cc00-47d2-49ed-bde5-c49775eab9da"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4428057-acab-4c9d-90f8-9249a7974b18"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02896312-a586-45a8-b7a0-d3845350a7c0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=83eb6028-3da5-4927-898c-a2d2d29c1e95"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1326, 6, 0.45248868778280543, 359.64253393665155, 98, 2802, 116.0, 1012.6999999999996, 1213.6499999999999, 1719.1700000000005, 5.151295010702728, 709.8030514673032, 3.760321983860441], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1712.9473684210518, 1205, 2196, 1715.0, 2074.0, 2157.1, 2196.0, 0.25133604952642996, 302.4417395389637, 1.235817391958569], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/e514d266-c102-4dce-9908-77345cf465d0", 3, 0, 0.0, 916.6666666666666, 222, 2221, 307.0, 2221.0, 2221.0, 2221.0, 0.08735150244584207, 0.039524280078034005, 0.05601642572210575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7de6fce8-1484-4489-aebd-04e85b5cec36", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 661.25, 416, 2004, 473.0, 1658.7000000000012, 2004.0, 2004.0, 0.06318948948158289, 0.011416069877043786, 0.04294910613201337], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 661.25, 416, 2004, 473.0, 1658.7000000000012, 2004.0, 2004.0, 0.06187927353732867, 0.011179360941802543, 0.04205856873240309], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 135.77777777777777, 98, 307, 102.5, 307.0, 307.0, 307.0, 0.11897994526922517, 0.031836430667741895, 0.06785575003635498], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 127.05555555555554, 99, 315, 104.0, 306.0, 315.0, 315.0, 0.11897444032440364, 0.08841752840514762, 0.05971959211596042], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 163.72222222222223, 99, 403, 102.5, 318.40000000000015, 403.0, 403.0, 0.1189767995240928, 0.03206796549672814, 0.07006153331350387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 159.11111111111111, 99, 307, 103.5, 306.1, 307.0, 307.0, 0.11897915881734716, 0.0320686013999881, 0.06994673203910448], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 239.69230769230768, 190, 421, 217.0, 375.4, 421.0, 421.0, 0.060829527588530365, 0.14769621324492777, 0.03932533912461631], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 128.375, 100, 306, 103.0, 302.5, 306.0, 306.0, 0.09708914604027986, 0.07215316419595016, 0.04873420025849985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 128.31250000000003, 99, 307, 102.0, 303.5, 307.0, 307.0, 0.09709091350413243, 0.044207654708302485, 0.05435289664672257], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 796.5, 790, 803, 796.5, 803.0, 803.0, 803.0, 0.09559315553006405, 28.107561717331038, 0.05451797151323965], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1048.0, 985, 1111, 1048.0, 1111.0, 1111.0, 1111.0, 0.09420631182289213, 84.76700497527084, 0.05363503886010362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 103.0, 102, 104, 103.0, 104.0, 104.0, 104.0, 0.09890707680134513, 0.17501916324613026, 0.054765930221057316], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 103.375, 99, 111, 103.0, 108.9, 111.0, 111.0, 0.08048897049576174, 0.05981651030007294, 0.04040169026838041], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 152.5625, 98, 318, 102.5, 306.1, 318.0, 318.0, 0.08049261480259187, 0.036650079737996534, 0.045060929136314244], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 238.5625, 99, 901, 103.0, 887.0, 901.0, 901.0, 0.08049220986331417, 9.072362260850099, 0.04645595315353386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 216.375, 98, 825, 103.0, 799.8000000000001, 825.0, 825.0, 0.08049220986331417, 2.9774060567872542, 0.046534558827228505], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 101.0, 100, 102, 101.0, 102.0, 102.0, 102.0, 0.09891686037885158, 0.07351145580889262, 0.05554413546664028], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2151661f-bc87-4a62-9ed0-1f5bcb2a96ce", 3, 0, 0.0, 587.3333333333334, 208, 1093, 461.0, 1093.0, 1093.0, 1093.0, 0.022806404038253944, 0.02695639748141278, 0.01462520050630217], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8171d83c-c4ce-4bff-9cdf-80585a4200cc", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.7676344651442308, 1.434326171875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 792.6666666666669, 102, 1371, 1095.0, 1332.6, 1371.0, 1371.0, 0.07199147620921684, 43.19183921123739, 0.038198602285489394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 238.99999999999997, 99, 1110, 103.0, 1079.2, 1110.0, 1110.0, 0.09697204780721957, 10.929822257054715, 0.05596726587311207], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 553.1333333333334, 98, 923, 777.0, 906.8, 923.0, 923.0, 0.0719928583084558, 14.11866192873667, 0.03826964115159776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 216.4375, 100, 810, 103.0, 801.6, 810.0, 810.0, 0.09696852159367765, 3.5868646667919175, 0.05605992654634489], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 450.8333333333333, 198, 680, 469.0, 663.8000000000001, 680.0, 680.0, 0.06201902950555329, 0.011204609822780622, 0.04275921370207092], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fd2e73cb-4708-4bfd-a4f6-b6eb3e672568", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 1.2005110432330826, 2.2431567199248117], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 356.8125, 200, 1004, 217.5, 987.2, 1004.0, 1004.0, 0.08044688243190926, 12.139397242306009, 0.17835403793070506], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fdd6cc00-47d2-49ed-bde5-c49775eab9da", 3, 0, 0.0, 416.3333333333333, 279, 504, 466.0, 504.0, 504.0, 504.0, 0.028857252789534438, 0.03410829585898423, 0.018505464842247018], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/026fdf1b-43ed-43ef-993c-9567f9238951", 3, 0, 0.0, 406.3333333333333, 193, 544, 482.0, 544.0, 544.0, 544.0, 0.030090270812437314, 0.024791170386158475, 0.019296169759277833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 597.1999999999999, 116, 1374, 469.5, 1161.4, 1363.4999999999998, 1374.0, 0.08881310170876408, 0.054554141576965434, 0.040156705167146256], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 103.53333333333333, 100, 119, 103.0, 111.2, 119.0, 119.0, 0.07198940315985487, 0.05349993730922808, 0.03613530588297403], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 155.93333333333334, 100, 307, 103.0, 307.0, 307.0, 307.0, 0.07199147620921684, 0.09134855933057526, 0.03702686601906334], "isController": false}, {"data": ["login", 20, 0, 0.0, 2575.7000000000003, 1764, 4389, 2588.5, 3532.6, 4346.249999999999, 4389.0, 0.0878379565377791, 10.63313633384133, 0.14709426549900742], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/83eb6028-3da5-4927-898c-a2d2d29c1e95", 3, 0, 0.0, 576.6666666666667, 238, 1197, 295.0, 1197.0, 1197.0, 1197.0, 0.03338638058248105, 0.027832851781163404, 0.021409885985510312], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a22e4b2a-f211-4062-a27e-5dd7acb53986", 3, 0, 0.0, 539.3333333333334, 217, 957, 444.0, 957.0, 957.0, 957.0, 0.0327475166466543, 0.027300257204453664, 0.02100019784957974], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 106.68750000000001, 101, 115, 106.0, 114.3, 115.0, 115.0, 0.09704910077942559, 0.07856807084584357, 0.03449792254268644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/34429699-fcf1-49d9-bf7e-51e4354d91e5", 3, 0, 0.0, 297.3333333333333, 201, 488, 203.0, 488.0, 488.0, 488.0, 0.02558722685635331, 0.030243235909967078, 0.016408475555669277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd890725-4b2d-4f9b-80e8-5904d272cde7", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fd52ba64-1dd7-43c7-b58c-56f7d1ebe251", 3, 0, 0.0, 300.0, 208, 453, 239.0, 453.0, 453.0, 453.0, 0.02101443691816278, 0.024838353011018572, 0.013476054924733293], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 897.0000000000001, 202, 1476, 1197.0, 1437.6, 1476.0, 1476.0, 0.07195417957844445, 57.42531437230771, 0.14955320202095304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80bd3191-5c29-4f46-9fb5-3901b9d1544c", 3, 0, 0.0, 310.0, 190, 539, 201.0, 539.0, 539.0, 539.0, 0.0252035184111702, 0.029789705517890296, 0.016162412522788182], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 349.00000000000006, 202, 719, 407.0, 622.7000000000002, 719.0, 719.0, 0.11889349784670665, 0.18426170027609715, 0.26739426322359905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1150.0, 1086, 1214, 1150.0, 1214.0, 1214.0, 1214.0, 0.09376025502789367, 112.16986135202288, 0.21141838755801418], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/395b04be-eb94-4ab0-8ce3-bbfb99e44e4b", 3, 0, 0.0, 293.6666666666667, 232, 401, 248.0, 401.0, 401.0, 401.0, 0.07523133635930487, 0.03404022055320109, 0.048244053589788595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32e12870-7510-4f15-93dd-b4d67ba54d29", 2, 0, 0.0, 212.5, 192, 233, 212.5, 233.0, 233.0, 233.0, 0.020337397423251746, 0.0341505418645326, 0.012641360800683338], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 1234.6190476190477, 254, 2118, 1084.0, 2067.2000000000003, 2117.1, 2118.0, 0.08470918529932595, 0.027180681666915413, 0.038218401961219325], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 394.37500000000006, 203, 1221, 210.0, 1183.2, 1221.0, 1221.0, 0.09690744128014729, 14.623287936991993, 0.21484777203735783], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 119.58823529411764, 101, 306, 106.0, 172.39999999999986, 306.0, 306.0, 0.11293429881086826, 0.08767848394007839, 0.04014461403042583], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 421.7368421052632, 202, 1218, 404.0, 1204.0, 1218.0, 1218.0, 0.09229259667649502, 11.750508785708735, 0.20508253660130085], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 102.33333333333333, 100, 105, 102.5, 105.0, 105.0, 105.0, 0.05640157924421884, 0.041915626762549354, 0.028310948956570787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 118.33333333333334, 99, 306, 101.0, 245.70000000000022, 306.0, 306.0, 0.056401844340309926, 0.015091899755121993, 0.03216667685033301], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 119.33333333333333, 99, 306, 102.5, 246.9000000000002, 306.0, 306.0, 0.05640025380114211, 0.015201630907339085, 0.03315718045731206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e514d266-c102-4dce-9908-77345cf465d0", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 118.08333333333334, 98, 294, 103.0, 237.3000000000002, 294.0, 294.0, 0.05635125616341865, 0.015188424512796431, 0.03318340572904438], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fd52ba64-1dd7-43c7-b58c-56f7d1ebe251", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1183.8771929824557, 789, 1751, 1091.0, 1639.6000000000001, 1729.1, 1751.0, 0.25268085521386996, 302.2941489143589, 0.49894598558832526], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 1234.6190476190477, 254, 2118, 1084.0, 2067.2000000000003, 2117.1, 2118.0, 0.08244249635878974, 0.026453367972267914, 0.03719573566187584], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 146.2857142857143, 99, 408, 103.0, 408.0, 408.0, 408.0, 0.036787504861206, 0.00991538216962193, 0.021662954522760954], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 175.42857142857144, 99, 409, 104.0, 409.0, 409.0, 409.0, 0.036787504861206, 0.00991538216962193, 0.021627029225044933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5a58939d-e872-40cd-a899-f029ab181526", 1, 0, 0.0, 998.0, 998, 998, 998.0, 998.0, 998.0, 998.0, 1.002004008016032, 0.31997588927855714, 0.5978754383767535], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 199.7647058823529, 100, 1169, 102.0, 478.5999999999994, 1169.0, 1169.0, 0.11548520770354267, 6.14187193242417, 0.06730887622703033], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 204.05882352941177, 98, 916, 103.0, 504.7999999999996, 916.0, 916.0, 0.11548520770354267, 2.026736205461771, 0.06742165475017832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 129.0, 99, 293, 102.0, 293.0, 293.0, 293.0, 0.03678769819372402, 0.00984358330574256, 0.02098048412610823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 127.41176470588238, 99, 304, 104.0, 302.4, 304.0, 304.0, 0.11532851667175469, 0.08570800897188019, 0.057889509345001866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 131.71428571428572, 103, 297, 104.0, 297.0, 297.0, 297.0, 0.036787311530720034, 0.027339007885622994, 0.018465505983193454], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 147.58823529411765, 98, 298, 102.0, 296.4, 298.0, 298.0, 0.11548756131030828, 0.041105292387331696, 0.0652934615358487], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 698.9166666666666, 401, 2221, 498.0, 1913.800000000001, 2221.0, 2221.0, 0.060745652889215115, 0.010974556430180466, 0.04134738287478803], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 136.85714285714286, 104, 307, 107.0, 307.0, 307.0, 307.0, 0.03792927815165209, 0.029854490420148032, 0.013482673092970078], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1423.75, 885, 2242, 1319.5, 2134.6000000000004, 2237.5499999999997, 2242.0, 0.08601151694211855, 0.04451767966730746, 0.039561937968493985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 308.42857142857144, 206, 706, 211.0, 706.0, 706.0, 706.0, 0.0367672162490086, 0.056982004089039695, 0.08269033107565117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2151661f-bc87-4a62-9ed0-1f5bcb2a96ce", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 0.2656824448529412, 1.0139016544117647], "isController": false}, {"data": ["addBook", 63, 4, 6.349206349206349, 1081.0317460317458, 511, 4491, 856.0, 1738.6000000000001, 1928.9999999999995, 4491.0, 0.2904001991315651, 94.83187938769348, 1.0561128521678604], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fd890725-4b2d-4f9b-80e8-5904d272cde7", 3, 0, 0.0, 353.66666666666663, 199, 643, 219.0, 643.0, 643.0, 643.0, 0.018577576864724277, 0.022284625894045885, 0.011913354955568627], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 193.0526315789474, 101, 538, 105.0, 417.4, 427.2999999999997, 538.0, 0.2540503197914113, 0.18880106773560937, 0.12280752763354355], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 627.0350877192982, 490, 920, 601.0, 806.4, 911.0, 920.0, 0.2536625309290279, 74.58520648185646, 0.12757441741059508], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 147.80701754385967, 99, 337, 105.0, 306.6, 309.4, 337.0, 0.25445179031386855, 0.45026039457883765, 0.12374706208623684], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 989.5263157894734, 683, 1408, 979.0, 1217.0, 1318.5, 1408.0, 0.2531915460675355, 227.822198214833, 0.1270902877721809], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 118.68421052631578, 102, 304, 106.0, 128.0, 304.0, 304.0, 0.0902990323745794, 0.06745972633452464, 0.03209848416440127], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7de6fce8-1484-4489-aebd-04e85b5cec36", 3, 0, 0.0, 394.3333333333333, 270, 492, 421.0, 492.0, 492.0, 492.0, 0.027269504513102998, 0.027349395639606228, 0.01748727991237399], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 4, 2.185792349726776, 180.93442622950826, 100, 2802, 109.0, 297.2, 330.79999999999995, 1354.6799999999942, 0.7525599374922894, 1.5592028917526835, 0.3645252356890242], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 124.08333333333333, 101, 307, 106.0, 251.2000000000002, 307.0, 307.0, 0.05772061299290998, 0.044699654397829705, 0.02051787414982347], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 117.1111111111111, 102, 300, 105.0, 136.20000000000027, 300.0, 300.0, 0.11660523298373357, 0.09462787950144785, 0.04144951641218655], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a22e4b2a-f211-4062-a27e-5dd7acb53986", 1, 0, 0.0, 402.0, 402, 402, 402.0, 402.0, 402.0, 402.0, 2.487562189054726, 0.4494130907960199, 1.7150575248756217], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 238.75, 201, 410, 207.0, 406.7, 410.0, 410.0, 0.056323748908727364, 0.08729081007631868, 0.12667343138359288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 381.9411764705882, 202, 1273, 216.0, 738.5999999999995, 1273.0, 1273.0, 0.11524798654988204, 8.278496971350705, 0.2574608771219188], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=026fdf1b-43ed-43ef-993c-9567f9238951", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80bd3191-5c29-4f46-9fb5-3901b9d1544c", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 0.2886007388178914, 1.1013628194888179], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=395b04be-eb94-4ab0-8ce3-bbfb99e44e4b", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=34429699-fcf1-49d9-bf7e-51e4354d91e5", 1, 0, 0.0, 421.0, 421, 421, 421.0, 421.0, 421.0, 421.0, 2.375296912114014, 0.42913078978622327, 1.6376558788598576], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 107.12500000000001, 102, 116, 107.5, 111.10000000000001, 116.0, 116.0, 0.08307372793354102, 0.06887655763239875, 0.02953011422637591], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 106.73333333333333, 101, 122, 105.0, 116.0, 122.0, 122.0, 0.07092433319306077, 0.05506332508640948, 0.02521138406472082], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fdd6cc00-47d2-49ed-bde5-c49775eab9da", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4428057-acab-4c9d-90f8-9249a7974b18", 1, 0, 0.0, 1586.0, 1586, 1586, 1586.0, 1586.0, 1586.0, 1586.0, 0.6305170239596469, 0.2013467449558638, 0.3762167008196721], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02896312-a586-45a8-b7a0-d3845350a7c0", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.7392035590277778, 1.3812029803240742], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=83eb6028-3da5-4927-898c-a2d2d29c1e95", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 114.94736842105262, 99, 311, 103.0, 111.0, 311.0, 311.0, 0.09233879590210144, 0.06862287468896405, 0.04634974716179701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 143.3157894736842, 99, 305, 102.0, 299.0, 305.0, 305.0, 0.09234059097978227, 0.039307400004860035, 0.05184665994362364], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 273.7368421052632, 99, 1116, 112.0, 1101.0, 1116.0, 1116.0, 0.0923410397601077, 8.768440490452424, 0.05345110967199491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 240.6842105263158, 100, 801, 123.0, 603.0, 801.0, 801.0, 0.09234059097978227, 2.880289840104977, 0.05354102625631804], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 33.333333333333336, 0.15082956259426847], "isController": false}, {"data": ["401/Unauthorized", 4, 66.66666666666667, 0.30165912518853694], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1326, 6, "401/Unauthorized", 4, "406/Not Acceptable", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 183, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
