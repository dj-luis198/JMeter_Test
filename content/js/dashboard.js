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

    var data = {"OkPercent": 99.33431952662721, "KoPercent": 0.665680473372781};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7968650031989764, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d0ac50de-026a-446b-a559-6a65e71642a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3d47135-8230-4bc8-83ad-98b47afdadfc"], "isController": false}, {"data": [0.13793103448275862, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0f45e62a-44f0-46bd-86e2-77806546462c"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/7cfa5cd4-1efa-4f85-9137-908a44c9d39c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88df7223-a202-428d-a5c3-69a23f8404d3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6bed0925-95e9-4ee7-8172-1ee1b810feb9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ba46c979-d444-4792-8496-12e4685b5a4e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.75, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/725e5f90-4db1-4fb4-8a2e-a087d03bf69e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/beceb6be-42b2-42c4-8055-624825ce905f"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7cfa5cd4-1efa-4f85-9137-908a44c9d39c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/60ad0d59-bc74-43b3-8776-647f153b2ded"], "isController": false}, {"data": [0.6944444444444444, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3d47135-8230-4bc8-83ad-98b47afdadfc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33c01575-887f-4daf-969a-e8c55f209812"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d0ac50de-026a-446b-a559-6a65e71642a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=919fd17b-dccc-42b9-ad6c-0b2a08b25c91"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0667e831-b85b-41ca-93df-3c3d445a584f"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88df7223-a202-428d-a5c3-69a23f8404d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9bc2848-5a79-44b8-9b13-b4928f6c6fb2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4396551724137931, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f45e62a-44f0-46bd-86e2-77806546462c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.35, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ba46c979-d444-4792-8496-12e4685b5a4e"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6bed0925-95e9-4ee7-8172-1ee1b810feb9"], "isController": false}, {"data": [0.3153846153846154, 500, 1500, "addBook"], "isController": true}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5258620689655172, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9521276595744681, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1106406d-761a-4975-b270-a19ac0508296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0667e831-b85b-41ca-93df-3c3d445a584f"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/96f9633b-be55-4500-afce-e9ecd1d0b5a1"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=60ad0d59-bc74-43b3-8776-647f153b2ded"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=725e5f90-4db1-4fb4-8a2e-a087d03bf69e"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/41905dca-548a-4726-868b-275c090fab46"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/919fd17b-dccc-42b9-ad6c-0b2a08b25c91"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33c01575-887f-4daf-969a-e8c55f209812"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f47c6b72-0ae3-4070-83e2-888fd8ca196e"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1352, 9, 0.665680473372781, 359.79585798816606, 97, 2598, 114.0, 1014.7, 1215.35, 1619.780000000002, 5.219694308139558, 723.9397812636331, 3.810814041392716], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/d0ac50de-026a-446b-a559-6a65e71642a1", 3, 0, 0.0, 652.6666666666666, 438, 1025, 495.0, 1025.0, 1025.0, 1025.0, 0.023292287147315953, 0.023360526269817855, 0.014936785703194148], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3d47135-8230-4bc8-83ad-98b47afdadfc", 3, 0, 0.0, 289.0, 191, 455, 221.0, 455.0, 455.0, 455.0, 0.04803535402055913, 0.03088210422871233, 0.03080392168636116], "isController": false}, {"data": ["see books", 58, 0, 0.0, 1681.8275862068965, 1223, 2224, 1649.0, 2032.3000000000002, 2161.95, 2224.0, 0.25968095061136953, 312.4832190280097, 1.2768492053986775], "isController": true}, {"data": ["deleteBook", 12, 0, 0.0, 512.8333333333334, 413, 722, 457.5, 720.2, 722.0, 722.0, 0.08640926307300142, 0.015611048504399672, 0.05873129599493066], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 512.8333333333334, 413, 722, 457.5, 720.2, 722.0, 722.0, 0.08485242748652967, 0.015329784262703115, 0.05767313430725064], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 152.5625, 99, 304, 103.0, 304.0, 304.0, 304.0, 0.08724052758709058, 0.031533105735519436, 0.04929643581550809], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 115.50000000000001, 99, 305, 103.0, 165.70000000000016, 305.0, 305.0, 0.08733433767821663, 0.06490374118469029, 0.04383774371738608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 182.875, 97, 798, 102.0, 451.50000000000034, 798.0, 798.0, 0.08724100327153762, 1.6252790178571428, 0.050904784623773174], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 202.12500000000003, 98, 1106, 102.5, 545.3000000000006, 1106.0, 1106.0, 0.08733767474358205, 4.933731046701093, 0.050875901352096374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f45e62a-44f0-46bd-86e2-77806546462c", 3, 0, 0.0, 396.66666666666663, 225, 667, 298.0, 667.0, 667.0, 667.0, 0.029857579346517112, 0.024891035386207787, 0.019146950297082913], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 372.5, 191, 1256, 209.5, 1186.7000000000003, 1256.0, 1256.0, 0.08724163752553635, 0.22414597479807194, 0.056400355509672914], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/7cfa5cd4-1efa-4f85-9137-908a44c9d39c", 3, 0, 0.0, 742.6666666666666, 314, 1256, 658.0, 1256.0, 1256.0, 1256.0, 0.052045383574476946, 0.032985794863120636, 0.03337545756566392], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 128.6, 99, 299, 102.0, 297.8, 299.0, 299.0, 0.08391045076694152, 0.0623592314781665, 0.04211911298262494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 114.59999999999998, 100, 295, 102.0, 180.40000000000006, 295.0, 295.0, 0.08391232839928843, 0.022453103497465845, 0.04785624979021918], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 792.5, 785, 800, 792.5, 800.0, 800.0, 800.0, 0.03041871359260217, 8.944111792574793, 0.017348172595780927], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1107.5, 1105, 1110, 1107.5, 1110.0, 1110.0, 1110.0, 0.030278257183516514, 27.244429037227118, 0.017238499939443486], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 101.5, 101, 102, 101.5, 102.0, 102.0, 102.0, 0.030745580322828595, 0.05440526518063029, 0.017024164104534972], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88df7223-a202-428d-a5c3-69a23f8404d3", 2, 0, 0.0, 209.0, 206, 212, 209.0, 212.0, 212.0, 212.0, 0.07579777154551656, 0.04452378865686349, 0.047114532801485635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6bed0925-95e9-4ee7-8172-1ee1b810feb9", 3, 0, 0.0, 543.0, 199, 1019, 411.0, 1019.0, 1019.0, 1019.0, 0.018667861409796892, 0.02573515399430008, 0.01197125227125647], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 126.76470588235294, 100, 306, 103.0, 302.8, 306.0, 306.0, 0.0816750103294866, 0.06069793248119073, 0.04099702666929308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 137.58823529411765, 98, 306, 102.0, 305.2, 306.0, 306.0, 0.08167579513788796, 0.02907072763524551, 0.04617722746708946], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 191.41176470588235, 101, 1001, 103.0, 444.99999999999955, 1001.0, 1001.0, 0.08167579513788796, 4.343779464843375, 0.04760355109541655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 190.88235294117646, 98, 813, 104.0, 406.5999999999996, 813.0, 813.0, 0.08167657996137179, 1.4334033339659265, 0.04768377080350537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ba46c979-d444-4792-8496-12e4685b5a4e", 1, 0, 0.0, 669.0, 669, 669, 669.0, 669.0, 669.0, 669.0, 1.4947683109118086, 0.2700509155455904, 1.030572683109118], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 202.5, 103, 302, 202.5, 302.0, 302.0, 302.0, 0.0307441624521544, 0.022847956666103026, 0.017263567783192168], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 653.8333333333334, 99, 1229, 927.5, 1214.6, 1229.0, 1229.0, 0.09136638427686045, 45.6840744743895, 0.04935133039607328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 157.13333333333333, 100, 313, 104.0, 310.0, 313.0, 313.0, 0.08381620781949341, 0.022591087263847835, 0.04927476280013187], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 504.66666666666663, 98, 916, 651.5, 911.5, 916.0, 916.0, 0.09136731182140737, 14.935958017989208, 0.04944105729745643], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 190.79999999999998, 100, 413, 104.0, 352.40000000000003, 413.0, 413.0, 0.08381667616588996, 0.02259121349783753, 0.04935689035940591], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 693.3333333333334, 331, 1278, 556.0, 1274.4, 1278.0, 1278.0, 0.08490345769331456, 0.015339003587171088, 0.05853695422996102], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 354.764705882353, 203, 1104, 213.0, 709.5999999999997, 1104.0, 1104.0, 0.0816346130759442, 5.863980077552882, 0.1823695121731614], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/725e5f90-4db1-4fb4-8a2e-a087d03bf69e", 3, 0, 0.0, 407.0, 213, 596, 412.0, 596.0, 596.0, 596.0, 0.02708901450165243, 0.022582996789951782, 0.017371535992270603], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/beceb6be-42b2-42c4-8055-624825ce905f", 1, 0, 0.0, 507.0, 507, 507, 507.0, 507.0, 507.0, 507.0, 1.9723865877712032, 0.6298539201183432, 1.1768830128205128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 618.2499999999999, 121, 1305, 630.5, 1176.7000000000005, 1299.75, 1305.0, 0.09857995573759988, 0.06055350796772492, 0.04457277295557494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 114.5, 100, 296, 104.0, 129.50000000000026, 296.0, 296.0, 0.09136545675114588, 0.06789952401134962, 0.04586117653329002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 199.16666666666666, 100, 413, 104.0, 321.20000000000016, 413.0, 413.0, 0.09136731182140737, 0.10068646037958041, 0.0478449052571736], "isController": false}, {"data": ["login", 20, 0, 0.0, 2527.9999999999995, 1476, 3526, 2539.0, 3369.5000000000005, 3518.85, 3526.0, 0.09159690036089178, 11.088171534087786, 0.15338902806529026], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 106.93333333333335, 103, 115, 106.0, 112.6, 115.0, 115.0, 0.08162598971512529, 0.06608197800179577, 0.029015488531548447], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7cfa5cd4-1efa-4f85-9137-908a44c9d39c", 1, 0, 0.0, 637.0, 637, 637, 637.0, 637.0, 637.0, 637.0, 1.5698587127158556, 0.28361705259026687, 1.082343995290424], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/60ad0d59-bc74-43b3-8776-647f153b2ded", 3, 0, 0.0, 608.3333333333333, 228, 1271, 326.0, 1271.0, 1271.0, 1271.0, 0.02237486854764728, 0.02644633714079013, 0.014348467135047248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 781.0555555555555, 206, 1333, 1032.5, 1319.5, 1333.0, 1333.0, 0.0913177146219954, 60.756085311038284, 0.19239540633846403], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3d47135-8230-4bc8-83ad-98b47afdadfc", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 0.4281138921800948, 1.6337751777251186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33c01575-887f-4daf-969a-e8c55f209812", 1, 0, 0.0, 398.0, 398, 398, 398.0, 398.0, 398.0, 398.0, 2.512562814070352, 0.4539298052763819, 1.7322942839195978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d0ac50de-026a-446b-a559-6a65e71642a1", 1, 0, 0.0, 1266.0, 1266, 1266, 1266.0, 1266.0, 1266.0, 1266.0, 0.7898894154818326, 0.14270463072669826, 0.5445917259083728], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=919fd17b-dccc-42b9-ad6c-0b2a08b25c91", 1, 0, 0.0, 401.0, 401, 401, 401.0, 401.0, 401.0, 401.0, 2.493765586034913, 0.45053382169576056, 1.7193344763092269], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0667e831-b85b-41ca-93df-3c3d445a584f", 3, 0, 0.0, 513.3333333333334, 198, 990, 352.0, 990.0, 990.0, 990.0, 0.021850759313886157, 0.030123035707782516, 0.014012368440219965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 357.25, 205, 1205, 214.0, 788.5000000000005, 1205.0, 1205.0, 0.08719060957134916, 6.646075477436705, 0.19469944102645145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1311.5, 1215, 1408, 1311.5, 1408.0, 1408.0, 1408.0, 0.030230202995813117, 36.16583250200275, 0.068165565153645], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1335.6666666666665, 745, 2387, 1245.0, 2112.6000000000004, 2365.3999999999996, 2387.0, 0.0876457109945284, 0.027976197929057058, 0.0395432797651095], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 107.72222222222223, 102, 117, 107.0, 117.0, 117.0, 117.0, 0.08982349682873154, 0.06973601560433748, 0.03192944613833817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 347.00000000000006, 205, 610, 397.0, 608.8, 610.0, 610.0, 0.08376706055800032, 0.12982258311088524, 0.18839408248542452], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88df7223-a202-428d-a5c3-69a23f8404d3", 1, 0, 0.0, 331.0, 331, 331, 331.0, 331.0, 331.0, 331.0, 3.0211480362537766, 0.5458128776435045, 2.082939954682779], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9bc2848-5a79-44b8-9b13-b4928f6c6fb2", 1, 0, 0.0, 423.0, 423, 423, 423.0, 423.0, 423.0, 423.0, 2.3640661938534278, 0.7549312943262412, 1.410590277777778], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 427.1111111111111, 205, 1310, 406.5, 1143.5000000000002, 1310.0, 1310.0, 0.10527731800183651, 14.13928298835516, 0.2337782457582014], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 120.91666666666667, 101, 304, 104.0, 245.8000000000002, 304.0, 304.0, 0.07058615923061086, 0.052457096850092644, 0.03543094320755272], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 118.66666666666666, 99, 299, 102.0, 241.1000000000002, 299.0, 299.0, 0.07058615923061086, 0.04539158774741919, 0.03877413531954942], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 400.83333333333337, 101, 1196, 105.5, 1192.4, 1196.0, 1196.0, 0.07013483421878562, 15.791039425639543, 0.039724808444234046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 252.91666666666669, 100, 810, 103.0, 777.0000000000001, 810.0, 810.0, 0.07029341643577233, 5.181359302601442, 0.03988327631756223], "isController": false}, {"data": ["https://demoqa.com/books", 58, 0, 0.0, 1149.1034482758625, 796, 1802, 1092.5, 1537.3000000000002, 1735.1999999999998, 1802.0, 0.251696783488691, 301.11685701235916, 0.49700282833411447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1335.6666666666665, 745, 2387, 1245.0, 2112.6000000000004, 2365.3999999999996, 2387.0, 0.08357676725064274, 0.0266774056179507, 0.03770748678691108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 104.77777777777777, 100, 122, 103.0, 122.0, 122.0, 122.0, 0.04304222442215814, 0.01160122455128481, 0.025346153639220072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 126.0, 100, 304, 103.0, 304.0, 304.0, 304.0, 0.04304243027126296, 0.011601280034051345, 0.0253042412336917], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 192.94444444444446, 99, 1119, 103.0, 390.9000000000011, 1119.0, 1119.0, 0.08877534412775759, 4.460387894310487, 0.05176635192519198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 185.61111111111114, 99, 601, 102.5, 336.40000000000043, 601.0, 601.0, 0.08877490629315447, 1.472752191630499, 0.05185279086111659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f45e62a-44f0-46bd-86e2-77806546462c", 1, 0, 0.0, 1005.0, 1005, 1005, 1005.0, 1005.0, 1005.0, 1005.0, 0.9950248756218905, 0.179765236318408, 0.6860230099502488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 126.72222222222223, 100, 302, 103.5, 297.5, 302.0, 302.0, 0.0887705281846427, 0.06597106635596982, 0.044558644030181976], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 125.0, 100, 298, 102.0, 298.0, 298.0, 298.0, 0.04304243027126296, 0.011517212787427783, 0.024547636014079655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 168.5, 99, 308, 103.0, 305.3, 308.0, 308.0, 0.08877534412775759, 0.031161918213248242, 0.05021548057052955], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 104.22222222222221, 102, 110, 104.0, 110.0, 110.0, 110.0, 0.043040577700198465, 0.0319862105760264, 0.021604352478419932], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 106.44444444444444, 105, 109, 106.0, 109.0, 109.0, 109.0, 0.04257593891771963, 0.03351192067156448, 0.015134415787158151], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 614.5454545454545, 379, 1271, 495.0, 1214.8000000000002, 1271.0, 1271.0, 0.09390232450936035, 0.016964775424054362, 0.06391593767873453], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1432.6499999999996, 915, 2598, 1346.0, 2265.4000000000005, 2583.25, 2598.0, 0.09470190208770343, 0.04901563291648713, 0.04355917566729328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 233.1111111111111, 206, 408, 208.0, 408.0, 408.0, 408.0, 0.04301918177516263, 0.06667132956756162, 0.09675114807441362], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ba46c979-d444-4792-8496-12e4685b5a4e", 3, 0, 0.0, 333.6666666666667, 203, 447, 351.0, 447.0, 447.0, 447.0, 0.016774864542968816, 0.023125504993318013, 0.01075731873360956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6bed0925-95e9-4ee7-8172-1ee1b810feb9", 1, 0, 0.0, 1012.0, 1012, 1012, 1012.0, 1012.0, 1012.0, 1012.0, 0.9881422924901185, 0.17852180088932806, 0.6812777915019763], "isController": false}, {"data": ["addBook", 65, 6, 9.23076923076923, 1078.9538461538455, 523, 3249, 852.0, 1796.2, 1848.5, 3249.0, 0.3035510806418471, 101.70331650716614, 1.1029858699890722], "isController": true}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 183.3793103448276, 102, 520, 104.0, 409.1, 412.2, 520.0, 0.2525461440993464, 0.1876832184175807, 0.12208041145427391], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 0, 0.0, 644.1724137931033, 493, 935, 606.0, 817.0, 897.75, 935.0, 0.252183781104478, 74.15040493432352, 0.12683071022344353], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 146.98275862068965, 100, 429, 104.0, 308.1, 318.3499999999997, 429.0, 0.2529227844182122, 0.44755477086503953, 0.12300346351588835], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 961.3620689655172, 690, 1349, 919.0, 1282.0, 1311.25, 1349.0, 0.25226055906159073, 226.9844944703833, 0.12662297593521255], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 118.77777777777777, 103, 310, 106.0, 133.60000000000028, 310.0, 310.0, 0.10335501874745201, 0.07721346615410232, 0.03673947932038333], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 6, 3.1914893617021276, 176.3191489361702, 100, 1908, 108.5, 307.1, 387.2999999999999, 1343.7399999999907, 0.78292882010961, 1.620939858156619, 0.3793694221527211], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 126.91666666666667, 103, 309, 105.5, 261.60000000000014, 309.0, 309.0, 0.0741042647004335, 0.05738738467523806, 0.026341750342732225], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1106406d-761a-4975-b270-a19ac0508296", 1, 0, 0.0, 628.0, 628, 628, 628.0, 628.0, 628.0, 628.0, 1.5923566878980893, 0.5084967157643312, 0.9501268909235668], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 107.0625, 101, 136, 105.0, 118.50000000000001, 136.0, 136.0, 0.08887703861707329, 0.07212579989334755, 0.03159300982091277], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0667e831-b85b-41ca-93df-3c3d445a584f", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/96f9633b-be55-4500-afce-e9ecd1d0b5a1", 1, 0, 0.0, 545.0, 545, 545, 545.0, 545.0, 545.0, 545.0, 1.834862385321101, 0.5859375, 1.094825114678899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 522.6666666666667, 205, 1398, 214.0, 1368.3000000000002, 1398.0, 1398.0, 0.07009304852191284, 21.04538648102231, 0.1531574180349414], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=60ad0d59-bc74-43b3-8776-647f153b2ded", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=725e5f90-4db1-4fb4-8a2e-a087d03bf69e", 1, 0, 0.0, 1278.0, 1278, 1278, 1278.0, 1278.0, 1278.0, 1278.0, 0.7824726134585289, 0.14136468114241002, 0.5394781885758998], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 387.1111111111111, 205, 1222, 401.0, 669.4000000000009, 1222.0, 1222.0, 0.0887254587845598, 6.026895328296521, 0.19828445628545938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/41905dca-548a-4726-868b-275c090fab46", 1, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 5.434782608695652, 1.7355213994565217, 3.2428243885869565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 108.3529411764706, 102, 123, 106.0, 121.4, 123.0, 123.0, 0.08600801392317967, 0.07130937873123001, 0.03057316119925527], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/919fd17b-dccc-42b9-ad6c-0b2a08b25c91", 3, 0, 0.0, 277.6666666666667, 196, 391, 246.0, 391.0, 391.0, 391.0, 0.017579532736019875, 0.024234805057631568, 0.011273333167304413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 118.22222222222223, 103, 306, 105.5, 136.80000000000027, 306.0, 306.0, 0.08895258333127425, 0.06905986694176076, 0.03161986360603889], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33c01575-887f-4daf-969a-e8c55f209812", 3, 0, 0.0, 266.0, 187, 379, 232.0, 379.0, 379.0, 379.0, 0.03655683369077793, 0.04320893982135894, 0.023443021605088713], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 115.27777777777777, 101, 308, 103.0, 130.70000000000027, 308.0, 308.0, 0.1054648362658417, 0.07837767617022025, 0.052938404141252574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 152.77777777777777, 99, 415, 103.0, 315.10000000000014, 415.0, 415.0, 0.10546421833436843, 0.045820174719055036, 0.05916341241196667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 281.72222222222223, 100, 1208, 104.0, 1033.4000000000003, 1208.0, 1208.0, 0.105340160936357, 10.556933522311631, 0.06092264081931236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 226.16666666666666, 100, 797, 104.0, 625.1000000000003, 797.0, 797.0, 0.10546545420455611, 3.4708616893808006, 0.061098096787991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f47c6b72-0ae3-4070-83e2-888fd8ca196e", 1, 0, 0.0, 354.0, 354, 354, 354.0, 354.0, 354.0, 354.0, 2.824858757062147, 0.9020789194915255, 1.6855358403954803], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 33.333333333333336, 0.22189349112426035], "isController": false}, {"data": ["401/Unauthorized", 6, 66.66666666666667, 0.4437869822485207], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1352, 9, "401/Unauthorized", 6, "406/Not Acceptable", 3, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 188, 6, "401/Unauthorized", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
